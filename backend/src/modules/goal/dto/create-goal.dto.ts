import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateGoalDto {
  @ApiProperty({ example: 10, description: 'ID do jogador autor do gol' })
  @IsInt()
  @Min(1)
  playerId: number;

  @ApiProperty({ example: 34, description: 'Minuto do gol na partida' })
  @IsInt()
  @Min(0)
  minute: number;
}
