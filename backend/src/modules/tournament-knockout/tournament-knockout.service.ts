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

@Injectable()
export class TournamentKnockoutService {
  constructor(
    @InjectRepository(TournamentKnockout)
    private readonly tournamentKnockoutRepository: Repository<TournamentKnockout>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  async create(createTournamentKnockoutDto: CreateTournamentKnockoutDto) {
    const match = await this.getMatchOrThrow(
      createTournamentKnockoutDto.matchId,
    );

    await this.ensureNoDuplicateMatch(createTournamentKnockoutDto.matchId);
    await this.ensureNoDuplicateSlot(
      createTournamentKnockoutDto.tournamentName,
      createTournamentKnockoutDto.stage,
      createTournamentKnockoutDto.slot,
    );

    const resolvedWinnerTeamId = this.resolveWinnerTeamId(
      match,
      createTournamentKnockoutDto.winnerTeamId,
    );

    const row = this.tournamentKnockoutRepository.create({
      tournamentName: createTournamentKnockoutDto.tournamentName,
      stage: createTournamentKnockoutDto.stage,
      roundOrder: createTournamentKnockoutDto.roundOrder ?? 1,
      slot: createTournamentKnockoutDto.slot,
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
        'match',
        'match.homeTeam',
        'match.awayTeam',
        'match.report',
        'winnerTeam',
      ],
      order: {
        tournamentName: 'ASC',
        roundOrder: 'ASC',
        slot: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const row = await this.tournamentKnockoutRepository.findOne({
      where: { id },
      relations: [
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

    const nextTournamentName =
      updateTournamentKnockoutDto.tournamentName ?? existing.tournamentName;
    const nextStage = updateTournamentKnockoutDto.stage ?? existing.stage;
    const nextSlot = updateTournamentKnockoutDto.slot ?? existing.slot;
    const nextMatchId = updateTournamentKnockoutDto.matchId ?? existing.matchId;

    if (nextMatchId !== existing.matchId) {
      await this.ensureNoDuplicateMatch(nextMatchId, id);
    }

    await this.ensureNoDuplicateSlot(
      nextTournamentName,
      nextStage,
      nextSlot,
      id,
    );

    const match = await this.getMatchOrThrow(nextMatchId);
    const providedWinnerTeamId = updateTournamentKnockoutDto.winnerTeamId;
    const resolvedWinnerTeamId =
      providedWinnerTeamId !== undefined
        ? this.resolveWinnerTeamId(match, providedWinnerTeamId)
        : existing.winnerTeamId;

    const rowToUpdate = this.tournamentKnockoutRepository.merge(existing, {
      ...updateTournamentKnockoutDto,
      tournamentName: nextTournamentName,
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
    tournamentName: string,
    stage: string,
    slot: number,
    excludeId?: number,
  ) {
    const existing = await this.tournamentKnockoutRepository.findOne({
      where: { tournamentName, stage, slot },
    });

    if (existing && existing.id !== excludeId) {
      throw new ConflictException(
        'Já existe confronto para este torneio/fase/posição',
      );
    }
  }
}
