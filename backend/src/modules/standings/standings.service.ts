import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStandingDto } from './dto/create-standing.dto';
import { UpdateStandingDto } from './dto/update-standing.dto';
import { MatchReport } from '../match-report/entities/match-report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EnumMatchReportStatus } from '../../types/match-report';

@Injectable()
export class StandingsService {

  constructor(
    @InjectRepository(MatchReport)
    private reportRepository: Repository<MatchReport>,
  ) {}

  create(_createStandingDto: CreateStandingDto) {
    throw new BadRequestException('Operação não suportada. Use GET /standings para consultar a classificação.');
  }

  async findAll() {
    return this.getStandings();
  }

  async findOne(id: number) {
    const standings = await this.getStandings();
    const teamStanding = standings.find((team) => team.id === id);

    if (!teamStanding) {
      throw new NotFoundException(`Classificação para o time ${id} não encontrada`);
    }

    return teamStanding;
  }

  update(_id: number, _updateStandingDto: UpdateStandingDto) {
    throw new BadRequestException('Operação não suportada. A classificação é calculada automaticamente.');
  }

  remove(_id: number) {
    throw new BadRequestException('Operação não suportada. A classificação é calculada automaticamente.');
  }

  async getStandings() {
    // Busca súmulas validadas com relacionamentos necessários
    const reports = await this.reportRepository.find({
      where: { status: EnumMatchReportStatus.VALIDATED },
      relations: ['match', 'match.homeTeam', 'match.awayTeam'],
    });

    // Lógica de cálculo (idêntica à anterior, pois é JS puro processando dados)
    const teamsMap = new Map<number, any>();

    const updateStats = (teamId: number, teamName: string, scored: number, conceded: number) => {
        // ... (Mesma lógica de cálculo de pontos do exemplo anterior)
        if (!teamsMap.has(teamId)) {
            teamsMap.set(teamId, {
              id: teamId, name: teamName, points: 0, games: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0
            });
          }
          const stats = teamsMap.get(teamId);
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

    reports.forEach(report => {
      updateStats(report.match.homeTeam.id, report.match.homeTeam.name, report.homeScore, report.awayScore);
      updateStats(report.match.awayTeam.id, report.match.awayTeam.name, report.awayScore, report.homeScore);
    });

    return Array.from(teamsMap.values()).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.gd - a.gd;
    });
  }
}