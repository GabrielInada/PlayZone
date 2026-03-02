import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  create(createCardDto: CreateCardDto) {
    void createCardDto;
    throw new BadRequestException(
      'Operação não suportada diretamente. Cartões devem ser registrados via súmula (match-report).',
    );
  }

  async findAll() {
    return this.cardRepository.find({
      relations: ['player', 'matchReport'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const card = await this.cardRepository.findOne({
      where: { id },
      relations: ['player', 'matchReport'],
    });

    if (!card) {
      throw new NotFoundException(`Cartão com ID ${id} não encontrado`);
    }

    return card;
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    void id;
    void updateCardDto;
    throw new BadRequestException(
      'Operação não suportada diretamente. Cartões devem ser alterados via súmula (match-report).',
    );
  }

  remove(id: number) {
    void id;
    throw new BadRequestException(
      'Operação não suportada diretamente. Cartões devem ser removidos via súmula (match-report).',
    );
  }
}
