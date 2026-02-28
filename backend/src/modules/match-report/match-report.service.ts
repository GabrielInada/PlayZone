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
import { ReviewMatchReportDto } from './dto/review-match-report.dto';
import { EnumReviewAction } from 'src/types/reviewMatchReport';

@Injectable()
export class MatchReportService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,

    @InjectRepository(MatchReport)
    private readonly matchReportRepository: Repository<MatchReport>,

    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    return this.matchReportRepository.find({
      relations: [
        'match',
        'match.homeTeam',
        'match.awayTeam',
        'goals',
        'goals.player',
        'cards',
        'cards.player',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const report = await this.matchReportRepository.findOne({
      where: { id },
      relations: [
        'match',
        'match.homeTeam',
        'match.awayTeam',
        'goals',
        'goals.player',
        'cards',
        'cards.player',
      ],
    });

    if (!report) {
      throw new NotFoundException(`Súmula com ID ${id} não encontrada`);
    }

    return report;
  }

  async update(id: number, updateMatchReportDto: UpdateMatchReportDto) {
    const report = await this.matchReportRepository.findOne({
      where: { id },
      relations: ['goals', 'cards'],
    });

    if (!report) {
      throw new NotFoundException(`Súmula com ID ${id} não encontrada`);
    }

    if (report.status === EnumMatchReportStatus.VALIDATED) {
      throw new BadRequestException('Súmula validada não pode ser alterada');
    }

    if (updateMatchReportDto.matchId && updateMatchReportDto.matchId !== report.matchId) {
      throw new BadRequestException('Não é permitido alterar a partida da súmula');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (updateMatchReportDto.goals) {
        await queryRunner.manager.delete(Goal, { matchReportId: report.id });
        report.goals = updateMatchReportDto.goals.map((goal) => ({ ...goal } as Goal));
      }

      if (updateMatchReportDto.cards) {
        await queryRunner.manager.delete(Card, { matchReportId: report.id });
        report.cards = updateMatchReportDto.cards.map((card) => ({ ...card } as Card));
      }

      if (updateMatchReportDto.homeScore !== undefined) {
        report.homeScore = updateMatchReportDto.homeScore;
      }

      if (updateMatchReportDto.awayScore !== undefined) {
        report.awayScore = updateMatchReportDto.awayScore;
      }

      if (updateMatchReportDto.observations !== undefined) {
        report.observations = updateMatchReportDto.observations;
      }

      report.status = EnumMatchReportStatus.PENDING;
      report.adminNote = null;

      const saved = await queryRunner.manager.save(report);
      await queryRunner.commitTransaction();
      return saved;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const report = await this.matchReportRepository.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException(`Súmula com ID ${id} não encontrada`);
    }

    await this.matchReportRepository.remove(report);
    await this.matchRepository.update(report.matchId, { status: EnumMatchStatus.SCHEDULED });

    return { message: 'Súmula removida com sucesso' };
  }

  async getAssignedMatches(delegateId: number) {
    return this.matchRepository.find({
      where: { delegateId },
      relations: ['homeTeam', 'awayTeam', 'report'],
      order: { date: 'ASC' },
    });
  }

  async create(delegateId: number, dto: CreateMatchReportDto) {
    const match = await this.matchRepository.findOne({
      where: { id: dto.matchId },
      relations: ['report'],
    });

    if (!match) {
      throw new NotFoundException('Partida não encontrada');
    }

    if (match.delegateId !== delegateId) {
      throw new ForbiddenException('Você não é o delegado designado para esta partida');
    }

    if (match.report && match.report.status === EnumMatchReportStatus.VALIDATED) {
      throw new BadRequestException('Súmula já validada pelo Admin, não pode ser alterada');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (match.report) {
        await queryRunner.manager.delete(Goal, { matchReportId: match.report.id });
        await queryRunner.manager.delete(Card, { matchReportId: match.report.id });
        await queryRunner.manager.delete(MatchReport, { id: match.report.id });
      }

      const newReport = queryRunner.manager.create(MatchReport, {
        matchId: dto.matchId,
        homeScore: dto.homeScore,
        awayScore: dto.awayScore,
        observations: dto.observations,
        status: EnumMatchReportStatus.PENDING,
        goals: dto.goals.map((goal) => ({ ...goal })),
        cards: dto.cards.map((card) => ({ ...card })),
      });

      const savedReport = await queryRunner.manager.save(newReport);

      await queryRunner.manager.update(Match, dto.matchId, { status: EnumMatchStatus.FINISHED });

      await queryRunner.commitTransaction();
      return savedReport;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async review(reportId: number, dto: ReviewMatchReportDto) {
    const report = await this.matchReportRepository.findOne({ where: { id: reportId } });
    if (!report) {
      throw new NotFoundException('Súmula não encontrada');
    }

    if (dto.action === EnumReviewAction.REJECT) {
      if (!dto.reason) {
        throw new BadRequestException('Motivo obrigatório');
      }
      report.status = EnumMatchReportStatus.REJECTED;
      report.adminNote = dto.reason;
    } else {
      report.status = EnumMatchReportStatus.VALIDATED;
      report.adminNote = null;
    }

    return this.matchReportRepository.save(report);
  }
}
