import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMatchReportDto } from './dto/create-match-report.dto';
import { UpdateMatchReportDto } from './dto/update-match-report.dto';
import { DataSource, Repository } from 'typeorm';
import { Match } from '../match/entities/match.entity';
import { MatchReport } from './entities/match-report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EnumMatchReportStatus } from 'src/types/match-report';
import { Goal } from '../goal/entities/goal.entity';
import { Card } from '../card/entities/card.entity';
import { EnumMatchStatus } from 'src/types/match';
import { ReviewMatchReportDto } from '../match-reports/dto/review-match-report.dto';
import { EnumReviewAction } from 'src/types/reviewMatchReport';

@Injectable()
export class MatchReportService {

  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    
    @InjectRepository(MatchReport)
    private matchReportRepository: Repository<MatchReport>,
    
    // DataSource é necessário para criar transações manuais no TypeORM
    private dataSource: DataSource
  ) {}

  //async create(createMatchReportDto: CreateMatchReportDto) {
  //  return 'This action adds a new matchReport';
  //}

  async findAll() {
    return `This action returns all matchReport`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} matchReport`;
  }

  async update(id: number, updateMatchReportDto: UpdateMatchReportDto) {
    return `This action updates a #${id} matchReport`;
  }

  async remove(id: number) {
    return `This action removes a #${id} matchReport`;
  }

  // Listar partidas designadas ao delegado logado
  async getAssignedMatches(delegateId: number) {
    return this.matchRepository.find({
      where: { delegateId },
      relations: ['homeTeam', 'awayTeam', 'report'], // Traz os dados dos times e status da súmula
      order: { date: 'ASC' }
    });
  }

  // US008: Criar ou Regravar Súmula (Transação Atômica)
  async create(delegateId: number, dto: CreateMatchReportDto) {
    // 1. Validar existência da partida
    const match = await this.matchRepository.findOne({
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
    if (match.report && match.report.status === EnumMatchReportStatus.VALIDATED) {
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
        status: EnumMatchReportStatus.PENDING, // Volta para status PENDENTE para nova aprovação
        goals: dto.goals.map(g => ({ ...g })), // Mapeia DTO para objeto de entidade
        cards: dto.cards.map(c => ({ ...c })),
      });

      const savedReport = await queryRunner.manager.save(newReport);

      // 6. Atualizar status da Partida para FINISHED
      await queryRunner.manager.update(Match, dto.matchId, { status: EnumMatchStatus.FINISHED });

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

  // Auditoria
  async review(reportId: number, dto: ReviewMatchReportDto) {
    const report = await this.matchReportRepository.findOne({ where: { id: reportId } });
    if (!report) throw new NotFoundException('Súmula não encontrada');  
      if (dto.action === EnumReviewAction.REJECT) {
        if (!dto.reason) throw new BadRequestException('Motivo obrigatório');
        report.status = EnumMatchReportStatus.REJECTED;
        report.adminNote = dto.reason;
      } else {
        report.status = EnumMatchReportStatus.VALIDATED;
        report.adminNote = null;
      }
  
      return this.matchReportRepository.save(report);
    }

}
