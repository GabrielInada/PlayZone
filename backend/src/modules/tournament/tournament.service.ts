import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { Repository } from 'typeorm';
import { Tournament } from './entities/tournament.entity';

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) {}

  async create(createTournamentDto: CreateTournamentDto) {
    const existing = await this.tournamentRepository.findOne({
      where: { name: createTournamentDto.name },
    });

    if (existing) {
      throw new ConflictException('Já existe campeonato com este nome');
    }

    const tournament = this.tournamentRepository.create(createTournamentDto);
    return this.tournamentRepository.save(tournament);
  }

  findAll() {
    return this.tournamentRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const tournament = await this.tournamentRepository.findOne({ where: { id } });

    if (!tournament) {
      throw new NotFoundException('Campeonato não encontrado');
    }

    return tournament;
  }

  async update(id: number, updateTournamentDto: UpdateTournamentDto) {
    const tournament = await this.findOne(id);

    if (updateTournamentDto.name && updateTournamentDto.name !== tournament.name) {
      const existing = await this.tournamentRepository.findOne({
        where: { name: updateTournamentDto.name },
      });

      if (existing) {
        throw new ConflictException('Já existe campeonato com este nome');
      }
    }

    const merged = this.tournamentRepository.merge(tournament, updateTournamentDto);
    return this.tournamentRepository.save(merged);
  }

  async remove(id: number) {
    const tournament = await this.findOne(id);
    await this.tournamentRepository.remove(tournament);
    return { message: 'Campeonato removido com sucesso' };
  }
}
