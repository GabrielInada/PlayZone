import { 
  BadRequestException, 
  ForbiddenException, 
  Injectable, 
  NotFoundException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

// DTOs
import { CreateMatchReportDto } from './dto/create-match-report.dto';
import { ReviewMatchReportDto, ReviewAction } from './dto/review-match-report.dto';

// Entidades e Enums
import { MatchReport } from './entities/match-report.entity';
import { Match } from '../matches/entities/match.entity';
import { Goal } from './entities/goal.entity';
import { Card } from './entities/card.entity';
import { MatchStatus, ReportStatus } from '../../common/enums/status.enum';

@Injectable()
export class MatchReportsService {
  constructor(
    @InjectRepository(Match)
    private matchRepo: Repository<Match>,
    
    @InjectRepository(MatchReport)
    private reportRepo: Repository<MatchReport>,
    
    // DataSource é necessário para criar transações manuais no TypeORM
    private dataSource: DataSource, 
  ) {}

  // Listar partidas designadas ao delegado logado
  async getAssignedMatches(delegateId: number) {
    return this.matchRepo.find({
      where: { delegateId },
      relations: ['homeTeam', 'awayTeam', 'report'], // Traz os dados dos times e status da súmula
      order: { date: 'ASC' }
    });
  }

  // US008: Criar ou Regravar Súmula (Transação Atômica)
  async create(delegateId: number, dto: CreateMatchReportDto) {
    // 1. Validar existência da partida
    const match = await this.matchRepo.findOne({
      where: { id: dto.matchId },
      relations: ['report'],
    });

    if (!match) throw new NotFoundException('Partida não encontrada');
    
    // 2. Validar permissão (Se o usuário é o delegado desta partida)
    // OBS: Se você estiver testando sem login, pode comentar essa linha temporariamente
    if (match.delegateId !== delegateId) {
      throw new ForbiddenException('Você não é o delegado designado para esta partida');
    }
    
    // 3. Bloquear edição se já validada
    if (match.report && match.report.status === ReportStatus.VALIDATED) {
      throw new BadRequestException('Súmula já validada pelo Admin, não pode ser alterada');
    }

    // INÍCIO DA TRANSAÇÃO
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 4. Se já existe um relatório (ex: foi rejeitado e está sendo corrigido), removemos o antigo
      if (match.report) {
        // Removemos primeiro os filhos para garantir integridade, embora o cascade devesse cuidar
        await queryRunner.manager.delete(Goal, { matchReportId: match.report.id });
        await queryRunner.manager.delete(Card, { matchReportId: match.report.id });
        await queryRunner.manager.delete(MatchReport, { id: match.report.id });
      }

      // 5. Criar a nova estrutura da Súmula
      // O TypeORM identifica "goals" e "cards" no objeto e cria automaticamente por causa do cascade: true na Entity
      const newReport = queryRunner.manager.create(MatchReport, {
        matchId: dto.matchId,
        homeScore: dto.homeScore,
        awayScore: dto.awayScore,
        observations: dto.observations,
        status: ReportStatus.PENDING, // Volta para status PENDENTE para nova aprovação
        goals: dto.goals.map(g => ({ ...g })), // Mapeia DTO para objeto de entidade
        cards: dto.cards.map(c => ({ ...c })),
      });

      const savedReport = await queryRunner.manager.save(newReport);

      // 6. Atualizar status da Partida para FINISHED
      await queryRunner.manager.update(Match, dto.matchId, { status: MatchStatus.FINISHED });

      // CONFIRMA A TRANSAÇÃO
      await queryRunner.commitTransaction();
      return savedReport;

    } catch (err) {
      // SE DER ERRO, DESFAZ TUDO
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  //  Admin Valida ou Rejeita
  async review(reportId: number, dto: ReviewMatchReportDto) {
    const report = await this.reportRepo.findOne({ where: { id: reportId } });
    
    if (!report) throw new NotFoundException('Súmula não encontrada');

    if (dto.action === ReviewAction.REJECT) {
      if (!dto.reason) throw new BadRequestException('Motivo é obrigatório ao rejeitar');
      
      report.status = ReportStatus.REJECTED;
      report.adminNote = dto.reason;
    } else {
      report.status = ReportStatus.VALIDATED;
      report.adminNote = null; 
      // Ao validar, a tabela de classificação (Self-Consult) será atualizada automaticamente
      // pois ela consulta apenas partidas com status VALIDATED.
    }

    return this.reportRepo.save(report);
  }
}