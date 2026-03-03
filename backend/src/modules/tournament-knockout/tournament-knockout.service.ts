import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTournamentKnockoutDto } from './dto/create-tournament-knockout.dto';
import { UpdateTournamentKnockoutDto } from './dto/update-tournament-knockout.dto';
import { TournamentKnockout } from './entities/tournament-knockout.entity';
import { Repository } from 'typeorm';
import { Match } from '../match/entities/match.entity';
import { EnumMatchReportStatus } from '../../types/match-report';
import { Tournament } from '../tournament/entities/tournament.entity';

@Injectable()
export class TournamentKnockoutService {
  constructor(
    @InjectRepository(TournamentKnockout)
    private readonly tournamentKnockoutRepository: Repository<TournamentKnockout>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) {}

  async create(createTournamentKnockoutDto: CreateTournamentKnockoutDto) {
    await this.getTournamentOrThrow(createTournamentKnockoutDto.tournamentId);
    const match = await this.getMatchOrThrow(
      createTournamentKnockoutDto.matchId,
    );

    await this.ensureNoDuplicateMatch(createTournamentKnockoutDto.matchId);
    if (createTournamentKnockoutDto.slot !== undefined) {
      await this.ensureNoDuplicateSlot(
        createTournamentKnockoutDto.tournamentId,
        createTournamentKnockoutDto.stage,
        createTournamentKnockoutDto.slot,
      );
    }

    const resolvedWinnerTeamId = this.resolveWinnerTeamId(
      match,
      createTournamentKnockoutDto.winnerTeamId,
    );

    const row = this.tournamentKnockoutRepository.create({
      tournamentId: createTournamentKnockoutDto.tournamentId,
      stage: createTournamentKnockoutDto.stage,
      roundOrder: createTournamentKnockoutDto.roundOrder ?? 1,
      slot: createTournamentKnockoutDto.slot ?? null,
      matchId: createTournamentKnockoutDto.matchId,
      winnerTeamId: resolvedWinnerTeamId,
      isDecided: Boolean(resolvedWinnerTeamId),
      notes: createTournamentKnockoutDto.notes,
    });

    return this.tournamentKnockoutRepository.save(row);
  }

  async findAll() {
    return this.tournamentKnockoutRepository.find({
      relations: [
        'tournament',
        'match',
        'match.homeTeam',
        'match.awayTeam',
        'match.report',
        'winnerTeam',
      ],
      order: {
        tournamentId: 'ASC',
        roundOrder: 'ASC',
        slot: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const row = await this.tournamentKnockoutRepository.findOne({
      where: { id },
      relations: [
        'tournament',
        'match',
        'match.homeTeam',
        'match.awayTeam',
        'match.report',
        'winnerTeam',
      ],
    });

    if (!row) {
      throw new NotFoundException(
        `Confronto knockout com ID ${id} não encontrado`,
      );
    }

    return row;
  }

  async update(
    id: number,
    updateTournamentKnockoutDto: UpdateTournamentKnockoutDto,
  ) {
    const existing = await this.findOne(id);

    const nextTournamentId =
      updateTournamentKnockoutDto.tournamentId ?? existing.tournamentId;
    const nextStage = updateTournamentKnockoutDto.stage ?? existing.stage;
    const nextSlot =
      updateTournamentKnockoutDto.slot !== undefined
        ? updateTournamentKnockoutDto.slot
        : existing.slot;
    const nextMatchId = updateTournamentKnockoutDto.matchId ?? existing.matchId;

    await this.getTournamentOrThrow(nextTournamentId);

    if (nextMatchId !== existing.matchId) {
      await this.ensureNoDuplicateMatch(nextMatchId, id);
    }

    if (nextSlot !== null) {
      await this.ensureNoDuplicateSlot(nextTournamentId, nextStage, nextSlot, id);
    }

    const match = await this.getMatchOrThrow(nextMatchId);
    const providedWinnerTeamId = updateTournamentKnockoutDto.winnerTeamId;
    const resolvedWinnerTeamId =
      providedWinnerTeamId !== undefined
        ? this.resolveWinnerTeamId(match, providedWinnerTeamId)
        : existing.winnerTeamId;

    const rowToUpdate = this.tournamentKnockoutRepository.merge(existing, {
      ...updateTournamentKnockoutDto,
      tournamentId: nextTournamentId,
      stage: nextStage,
      slot: nextSlot,
      matchId: nextMatchId,
      winnerTeamId: resolvedWinnerTeamId ?? null,
      isDecided: Boolean(resolvedWinnerTeamId),
    });

    return this.tournamentKnockoutRepository.save(rowToUpdate);
  }

  async remove(id: number) {
    const row = await this.findOne(id);
    await this.tournamentKnockoutRepository.remove(row);
    return { message: 'Confronto knockout removido com sucesso' };
  }

  private async getMatchOrThrow(matchId: number) {
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
      relations: ['homeTeam', 'awayTeam', 'report'],
    });

    if (!match) {
      throw new NotFoundException(`Partida com ID ${matchId} não encontrada`);
    }

    return match;
  }

  private async getTournamentOrThrow(tournamentId: number) {
    const tournament = await this.tournamentRepository.findOne({
      where: { id: tournamentId },
    });

    if (!tournament) {
      throw new NotFoundException(
        `Campeonato com ID ${tournamentId} não encontrado`,
      );
    }

    return tournament;
  }

  private resolveWinnerTeamId(match: Match, winnerTeamId?: number | null) {
    if (winnerTeamId === undefined) {
      if (
        match.report &&
        match.report.status === EnumMatchReportStatus.VALIDATED &&
        match.report.homeScore !== match.report.awayScore
      ) {
        return match.report.homeScore > match.report.awayScore
          ? match.homeTeam.id
          : match.awayTeam.id;
      }

      return null;
    }

    if (winnerTeamId === null) {
      return null;
    }

    if (
      winnerTeamId !== match.homeTeam.id &&
      winnerTeamId !== match.awayTeam.id
    ) {
      throw new BadRequestException(
        'O vencedor deve ser um dos times da partida vinculada',
      );
    }

    return winnerTeamId;
  }

  private async ensureNoDuplicateMatch(matchId: number, excludeId?: number) {
    const existing = await this.tournamentKnockoutRepository.findOne({
      where: { matchId },
    });

    if (existing && existing.id !== excludeId) {
      throw new ConflictException(
        'Esta partida já está vinculada a um confronto knockout',
      );
    }
  }

  private async ensureNoDuplicateSlot(
    tournamentId: number,
    stage: string,
    slot: number,
    excludeId?: number,
  ) {
    const existing = await this.tournamentKnockoutRepository.findOne({
      where: { tournamentId, stage, slot },
    });

    if (existing && existing.id !== excludeId) {
      throw new ConflictException(
        'Já existe confronto para este torneio/fase/posição',
      );
    }
  }
}
