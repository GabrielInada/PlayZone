import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateTournamentKnockoutDto {
  @ApiProperty({ example: 'Copa PlayZone 2026' })
  @IsString()
  tournamentName: string;

  @ApiProperty({ example: 'QUARTER_FINAL' })
  @IsString()
  stage: string;

  @ApiPropertyOptional({ example: 1, description: 'Ordem da fase no torneio' })
  @IsOptional()
  @IsInt()
  @Min(1)
  roundOrder?: number;

  @ApiProperty({
    example: 1,
    description: 'Posição do confronto dentro da fase',
  })
  @IsInt()
  @Min(1)
  slot: number;

  @ApiProperty({
    example: 42,
    description: 'ID da partida já existente no módulo match',
  })
  @IsInt()
  @Min(1)
  matchId: number;

  @ApiPropertyOptional({
    example: 7,
    description: 'ID do time vencedor (opcional/manual)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  winnerTeamId?: number;

  @ApiPropertyOptional({ example: 'W.O. visitante' })
  @IsOptional()
  @IsString()
  notes?: string;
}
