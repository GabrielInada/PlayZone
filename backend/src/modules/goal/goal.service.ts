import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
  ) {}

  create(createGoalDto: CreateGoalDto) {
    void createGoalDto;
    throw new BadRequestException(
      'Operação não suportada diretamente. Gols devem ser registrados via súmula (match-report).',
    );
  }

  async findAll() {
    return this.goalRepository.find({
      relations: ['player', 'matchReport'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const goal = await this.goalRepository.findOne({
      where: { id },
      relations: ['player', 'matchReport'],
    });

    if (!goal) {
      throw new NotFoundException(`Gol com ID ${id} não encontrado`);
    }

    return goal;
  }

  update(id: number, updateGoalDto: UpdateGoalDto) {
    void id;
    void updateGoalDto;
    throw new BadRequestException(
      'Operação não suportada diretamente. Gols devem ser alterados via súmula (match-report).',
    );
  }

  remove(id: number) {
    void id;
    throw new BadRequestException(
      'Operação não suportada diretamente. Gols devem ser removidos via súmula (match-report).',
    );
  }
}
