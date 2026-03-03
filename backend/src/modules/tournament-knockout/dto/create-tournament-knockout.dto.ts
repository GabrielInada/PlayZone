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
  @ApiProperty({ example: 1, description: 'ID do campeonato' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  tournamentId: number;

  @ApiProperty({ example: 'QUARTER_FINAL' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  stage: string;

  @ApiPropertyOptional({ example: 1, description: 'Ordem da fase no campeonato' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  roundOrder?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Posição do confronto dentro da fase (opcional)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  slot?: number;

  @ApiProperty({
    example: 42,
    description: 'ID de uma partida existente do módulo de partidas',
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

  @ApiPropertyOptional({ example: 'W.O. do time visitante' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
