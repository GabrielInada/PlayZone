import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    const team = this.teamRepository.create({
      ...createTeamDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const createdTeam = await this.teamRepository.save(team);
    return createdTeam;
  }

  async findAll() {
    const teams = await this.teamRepository.find({
      relations: ['players'],
    });
    if (!teams || teams.length === 0) {
      throw new HttpException('No teams found', 404);
    }
    return teams;
  }

  async findOne(id: number) {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['players', 'homeMatches', 'awayMatches'],
    });
    if (!team) {
      throw new HttpException(`Team with ID ${id} not found`, 404);
    }
    return team;
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    const team = await this.teamRepository.preload({
      id,
      ...updateTeamDto,
      updatedAt: new Date(),
    });

    if (!team) {
      throw new HttpException(`Team with ID ${id} not found`, 404);
    }

    return this.teamRepository.save(team);
  }

  async remove(id: number) {
    const team = await this.findOne(id);

    if (team.players && team.players.length > 0) {
      throw new HttpException(
        `Cannot delete team with ${team.players.length} player(s). Remove players first.`,
        409,
      );
    }

    return this.teamRepository.remove(team);
  }
}
