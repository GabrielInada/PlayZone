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
  @ApiProperty({ example: 'João Silva', description: 'Player name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 10, description: 'Player shirt number' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  shirtNumber: number;

  @ApiProperty({
    enum: EnumPlayerPosition,
    example: 'goleiro',
    description: 'Player position',
  })
  @IsEnum(EnumPlayerPosition)
  position: EnumPlayerPosition;

  @ApiProperty({ example: 1, description: 'Team ID' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  teamId: number;
}
