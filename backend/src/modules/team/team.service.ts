import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import { Club } from '../club/entities/club.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,

    @InjectRepository(Club)
    private clubRepository: Repository<Club>,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    await this.ensureClubExists(createTeamDto.clubId);

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
      relations: ['players', 'club'],
    });
    if (!teams || teams.length === 0) {
      throw new HttpException('No teams found', 404);
    }
    return teams;
  }

  async findOne(id: number) {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['players', 'homeMatches', 'awayMatches', 'club'],
    });
    if (!team) {
      throw new HttpException(`Team with ID ${id} not found`, 404);
    }
    return team;
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    if (updateTeamDto.clubId !== undefined) {
      await this.ensureClubExists(updateTeamDto.clubId);
    }

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

  private async ensureClubExists(clubId: number) {
    const club = await this.clubRepository.findOne({ where: { id: clubId } });

    if (!club) {
      throw new HttpException(`Club with ID ${clubId} not found`, 404);
    }
  }
}
