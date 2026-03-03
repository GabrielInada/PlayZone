import { Type } from 'class-transformer';
import {
  IsOptional,
  ValidateNested,
  Min,
  IsArray,
  IsInt,
  IsString,
} from 'class-validator';
import { CreateCardDto } from '../../card/dto/create-card.dto';
import { CreateGoalDto } from '../../goal/dto/create-goal.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMatchReportDto {
  @ApiProperty({
    example: 1,
    description: 'ID da partida associada à súmula',
  })
  @Type(() => Number)
  @IsInt()
  matchId: number;

  @ApiProperty({ example: 2, description: 'Gols do time mandante' })
  @IsInt()
  @Min(0)
  homeScore: number;

  @ApiProperty({ example: 1, description: 'Gols do time visitante' })
  @IsInt()
  @Min(0)
  awayScore: number;

  @ApiPropertyOptional({
    example: 'Match finished without major incidents',
    description: 'Observações gerais da partida',
  })
  @IsString()
  @IsOptional()
  observations?: string;

  @ApiProperty({
    type: [CreateGoalDto],
    description: 'Lista de gols registrados na súmula',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGoalDto)
  goals: CreateGoalDto[];

  @ApiProperty({
    type: [CreateCardDto],
    description: 'Lista de cartões registrados na súmula',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCardDto)
  cards: CreateCardDto[];
}
