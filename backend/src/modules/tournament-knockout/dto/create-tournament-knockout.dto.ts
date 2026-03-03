import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTournamentKnockoutDto {
  @ApiProperty({ example: 'Copa PlayZone 2026' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  tournamentName: string;

  @ApiProperty({ example: 'QUARTER_FINAL' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  stage: string;

  @ApiPropertyOptional({ example: 1, description: 'Ordem da fase no torneio' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  roundOrder?: number;

  @ApiProperty({
    example: 1,
    description: 'Posição do confronto dentro da fase',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  slot: number;

  @ApiProperty({
    example: 42,
    description: 'ID da partida já existente no módulo match',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  matchId: number;

  @ApiPropertyOptional({
    example: 7,
    description: 'ID do time vencedor (opcional/manual)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  winnerTeamId?: number;

  @ApiPropertyOptional({ example: 'W.O. visitante' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
