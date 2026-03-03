import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { EnumPlayerPosition } from '../../../types/player';

export class CreatePlayerDto {
  @ApiProperty({ example: 'John Silva', description: 'Nome do jogador' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 10, description: 'Número da camisa do jogador' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  shirtNumber: number;

  @ApiProperty({
    enum: EnumPlayerPosition,
    example: 'goleiro',
    description: 'Posição do jogador',
  })
  @IsEnum(EnumPlayerPosition)
  position: EnumPlayerPosition;

  @ApiProperty({ example: 1, description: 'ID do time' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  teamId: number;
}
