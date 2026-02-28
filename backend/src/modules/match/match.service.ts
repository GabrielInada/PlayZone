import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from '../team/entities/team.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Match } from './entities/match.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createMatchDto: CreateMatchDto) {
    this.validateHomeAway(createMatchDto.homeTeamId, createMatchDto.awayTeamId);

    const [homeTeam, awayTeam] = await Promise.all([
      this.teamRepository.findOne({ where: { id: createMatchDto.homeTeamId } }),
      this.teamRepository.findOne({ where: { id: createMatchDto.awayTeamId } }),
    ]);

    if (!homeTeam || !awayTeam) {
      throw new NotFoundException('Time mandante e/ou visitante não encontrado');
    }

    let delegate: User | null = null;
    if (createMatchDto.delegateId) {
      delegate = await this.userRepository.findOne({ where: { id: createMatchDto.delegateId } });
      if (!delegate) {
        throw new NotFoundException('Delegado não encontrado');
      }
    }

    const match = this.matchRepository.create({
      date: createMatchDto.date,
      location: createMatchDto.location,
      status: createMatchDto.status,
      homeTeam,
      awayTeam,
      delegate: delegate ?? undefined,
      delegateId: createMatchDto.delegateId,
    });

    return this.matchRepository.save(match);
  }

  async findAll() {
    return this.matchRepository.find({
      relations: ['homeTeam', 'awayTeam', 'delegate', 'report'],
      order: { date: 'ASC' },
    });
  }

  async findOne(id: number) {
    const match = await this.matchRepository.findOne({
      where: { id },
      relations: ['homeTeam', 'awayTeam', 'delegate', 'report'],
    });

    if (!match) {
      throw new NotFoundException(`Partida com ID ${id} não encontrada`);
    }

    return match;
  }

  async update(id: number, updateMatchDto: UpdateMatchDto) {
    const existingMatch = await this.findOne(id);

    const nextHomeTeamId = updateMatchDto.homeTeamId ?? existingMatch.homeTeam?.id;
    const nextAwayTeamId = updateMatchDto.awayTeamId ?? existingMatch.awayTeam?.id;

    this.validateHomeAway(nextHomeTeamId, nextAwayTeamId);

    let homeTeam = existingMatch.homeTeam;
    let awayTeam = existingMatch.awayTeam;
    let delegate = existingMatch.delegate;

    if (updateMatchDto.homeTeamId) {
      const foundHomeTeam = await this.teamRepository.findOne({ where: { id: updateMatchDto.homeTeamId } });
      if (!foundHomeTeam) {
        throw new NotFoundException('Time mandante não encontrado');
      }
      homeTeam = foundHomeTeam;
    }

    if (updateMatchDto.awayTeamId) {
      const foundAwayTeam = await this.teamRepository.findOne({ where: { id: updateMatchDto.awayTeamId } });
      if (!foundAwayTeam) {
        throw new NotFoundException('Time visitante não encontrado');
      }
      awayTeam = foundAwayTeam;
    }

    if (updateMatchDto.delegateId !== undefined) {
      const foundDelegate = await this.userRepository.findOne({ where: { id: updateMatchDto.delegateId } });
      if (!foundDelegate) {
        throw new NotFoundException('Delegado não encontrado');
      }
      delegate = foundDelegate;
    }

    const matchToUpdate = this.matchRepository.merge(existingMatch, {
      ...updateMatchDto,
      homeTeam,
      awayTeam,
      delegate,
      delegateId: updateMatchDto.delegateId ?? existingMatch.delegateId,
    });

    return this.matchRepository.save(matchToUpdate);
  }

  async remove(id: number) {
    const match = await this.findOne(id);
    return this.matchRepository.remove(match);
  }

  private validateHomeAway(homeTeamId?: number, awayTeamId?: number) {
    if (!homeTeamId || !awayTeamId) {
      return;
    }

    if (homeTeamId === awayTeamId) {
      throw new BadRequestException('Time mandante e visitante devem ser diferentes');
    }
  }
}
