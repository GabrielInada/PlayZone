import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateMatchReportDto } from '../../modules/match-reports/dto/create-match-report.dto';
import { ReviewAction, ReviewMatchReportDto } from '../../modules/match-reports/dto/review-match-report.dto';
import { MatchReport } from '../../modules/match-reports/entities/match-report.entity';
import { Match } from '../../modules/matches/entities/match.entity';
import { Goal } from '../../modules/match-reports/entities/goal.entity';
import { Card } from '../../modules/match-reports/entities/card.entity';
import { MatchStatus, ReportStatus } from '../../common/enums/status.enum';

@Injectable()
export class MatchReportsService {
  constructor(
    @InjectRepository(Match)
    private matchRepo: Repository<Match>,
    @InjectRepository(MatchReport)
    private reportRepo: Repository<MatchReport>,
    private dataSource: DataSource, // Necessário para transações manuais
  ) {}

  // Listar partidas designadas ao delegado
  async getAssignedMatches(delegateId: number) {
    return this.matchRepo.find({
      where: { delegateId },
      relations: ['homeTeam', 'awayTeam', 'report'],
    });
  }

  // Criar Súmula (Transação com TypeORM)
  async create(delegateId: number, dto: CreateMatchReportDto) {
    const match = await this.matchRepo.findOne({
      where: { id: dto.matchId },
      relations: ['report'],
    });

    if (!match) throw new NotFoundException('Partida não encontrada');
    if (match.delegateId !== delegateId) throw new ForbiddenException('Você não é o delegado desta partida');
    
    if (match.report && match.report.status === ReportStatus.VALIDATED) {
      throw new BadRequestException('Súmula já validada, não pode ser alterada');
    }

    // Usando QueryRunner para transação
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Se já existe (rejeitada/pendente), limpar dados antigos
      if (match.report) {
        // No TypeORM, precisamos remover explicitamente ou configurar CASCADE na entidade.
        // Aqui removemos a entidade pai, o cascade do DB cuidaria dos filhos ou removemos manualmente.
        await queryRunner.manager.delete(Goal, { matchReport: { id: match.report.id } });
        await queryRunner.manager.delete(Card, { matchReport: { id: match.report.id } });
        await queryRunner.manager.delete(MatchReport, { id: match.report.id });
      }

      // 2. Criar nova súmula
      // O TypeORM cria as entidades filhas (Goal/Card) automaticamente se cascade: true na Entity
      const newReport = queryRunner.manager.create(MatchReport, {
        matchId: dto.matchId,
        homeScore: dto.homeScore,
        awayScore: dto.awayScore,
        observations: dto.observations,
        status: ReportStatus.PENDING,
        goals: dto.goals, // Assumindo que o DTO mapeia corretamente para a entidade Goal
        cards: dto.cards,
      });

      const savedReport = await queryRunner.manager.save(newReport);

      // 3. Atualizar status da partida
      await queryRunner.manager.update(Match, dto.matchId, { status: MatchStatus.FINISHED });

      await queryRunner.commitTransaction();
      return savedReport;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // Auditoria
  async review(reportId: number, dto: ReviewMatchReportDto) {
    const report = await this.reportRepo.findOne({ where: { id: reportId } });
    if (!report) throw new NotFoundException('Súmula não encontrada');

    if (dto.action === ReviewAction.REJECT) {
      if (!dto.reason) throw new BadRequestException('Motivo obrigatório');
      report.status = ReportStatus.REJECTED;
      report.adminNote = dto.reason;
    } else {
      report.status = ReportStatus.VALIDATED;
      report.adminNote = null;
    }

    return this.reportRepo.save(report);
  }
}