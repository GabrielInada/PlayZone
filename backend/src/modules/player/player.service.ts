import { HttpException, Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { Team } from '../team/entities/team.entity';

@Injectable()
export class PlayerService {

  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,

    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}
  
  async getPlayerDetails(id: number) {
    const player = await this.findOne(id);
    return {
      player
    };
  }

  async create(createPlayerDto: CreatePlayerDto) {
    await this.ensureTeamExists(createPlayerDto.teamId);

    const player = this.playerRepository.create({
      ...createPlayerDto,
      createdAt: new Date(),
    });

    const createdPlayer = await this.playerRepository.save(player);

    return createdPlayer;
  }

  async findAll() {
    const findedPlayers = await this.playerRepository.find({ 
      relations: ['team']
    });
    if (!findedPlayers) {
      throw new HttpException('No players found', 404);
    }
    return findedPlayers;
  }

  async findOne(id: number) {
    const findedPlayer = await this.playerRepository.findOne({
      where: { id },
      relations: ['team'],
    });
    if (!findedPlayer) {
      throw new HttpException(`Player with ID ${id} not found`, 404);
    }
    return findedPlayer;
  }

  async update(id: number, updatePlayerDto: UpdatePlayerDto) {
    if (updatePlayerDto.teamId !== undefined) {
      await this.ensureTeamExists(updatePlayerDto.teamId);
    }

    const player = await this.playerRepository.preload({
      id,
      ...updatePlayerDto,
      updatedAt: new Date(),
    });

    if (!player) {
      throw new HttpException(`Player with ID ${id} not found`, 404);
    }

    return this.playerRepository.save(player);
  }

  async remove(id: number) {
    const player = await this.findOne(id);
    return this.playerRepository.remove(player);
  }

  private async ensureTeamExists(teamId: number) {
    const team = await this.teamRepository.findOne({ where: { id: teamId } });

    if (!team) {
      throw new HttpException(`Team with ID ${teamId} not found`, 404);
    }
  }
}
