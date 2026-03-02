import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStandingDto } from './dto/create-standing.dto';
import { UpdateStandingDto } from './dto/update-standing.dto';
import { MatchReport } from '../match-report/entities/match-report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Standing } from './entities/standing.entity';

import { EnumMatchReportStatus } from '../../types/match-report';

type TeamStandingAccumulator = {
  teamId: number;
  teamName: string;
  points: number;
  games: number;
  wins: number;
  draws: number;
  losses: number;
  gf: number;
  ga: number;
  gd: number;
};

@Injectable()
export class StandingsService {
  constructor(
    @InjectRepository(MatchReport)
    private reportRepository: Repository<MatchReport>,

    @InjectRepository(Standing)
    private standingRepository: Repository<Standing>,
  ) {}

  create(createStandingDto: CreateStandingDto) {
    void createStandingDto;
    throw new BadRequestException(
      'Operação não suportada. Use GET /standings para consultar a classificação.',
    );
  }

  async findAll() {
    await this.refreshPersistedStandings();
    return this.standingRepository.find({
      order: {
        position: 'ASC',
        points: 'DESC',
        wins: 'DESC',
        gd: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    await this.refreshPersistedStandings();
    const teamStanding = await this.standingRepository.findOne({
      where: [{ id }, { teamId: id }],
    });

    if (!teamStanding) {
      throw new NotFoundException(
        `Classificação para o time ${id} não encontrada`,
      );
    }

    return teamStanding;
  }

  update(id: number, updateStandingDto: UpdateStandingDto) {
    void id;
    void updateStandingDto;
    throw new BadRequestException(
      'Operação não suportada. A classificação é calculada automaticamente.',
    );
  }

  remove(id: number) {
    void id;
    throw new BadRequestException(
      'Operação não suportada. A classificação é calculada automaticamente.',
    );
  }

  async refreshPersistedStandings() {
    // Busca súmulas validadas com relacionamentos necessários
    const reports = await this.reportRepository.find({
      where: { status: EnumMatchReportStatus.VALIDATED },
      relations: ['match', 'match.homeTeam', 'match.awayTeam'],
    });

    const teamsMap = new Map<number, TeamStandingAccumulator>();

    const updateStats = (
      teamId: number,
      teamName: string,
      scored: number,
      conceded: number,
    ) => {
      if (!teamsMap.has(teamId)) {
        teamsMap.set(teamId, {
          teamId,
          teamName,
          points: 0,
          games: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          gf: 0,
          ga: 0,
          gd: 0,
        });
      }

      const stats = teamsMap.get(teamId);
      if (!stats) {
        return;
      }

      stats.games++;
      stats.gf += scored;
      stats.ga += conceded;
      stats.gd = stats.gf - stats.ga;

      if (scored > conceded) {
        stats.points += 3;
        stats.wins++;
      } else if (scored === conceded) {
        stats.points += 1;
        stats.draws++;
      } else {
        stats.losses++;
      }
    };

    reports.forEach((report) => {
      updateStats(
        report.match.homeTeam.id,
        report.match.homeTeam.name,
        report.homeScore,
        report.awayScore,
      );
      updateStats(
        report.match.awayTeam.id,
        report.match.awayTeam.name,
        report.awayScore,
        report.homeScore,
      );
    });

    const sortedStandings = Array.from(teamsMap.values()).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.gd - a.gd;
    });

    await this.standingRepository.clear();

    if (sortedStandings.length === 0) {
      return;
    }

    const now = new Date();
    const persistedRows = sortedStandings.map((standing, index) =>
      this.standingRepository.create({
        ...standing,
        position: index + 1,
        lastUpdatedAt: now,
      }),
    );

    await this.standingRepository.save(persistedRows);
  }
}
