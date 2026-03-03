import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CreateGoalDto {
  @ApiProperty({ example: 10, description: 'ID do jogador que marcou o gol' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  playerId: number;

  @ApiProperty({ example: 34, description: 'Minuto do gol na partida' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minute: number;
}
