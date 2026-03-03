import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, Min } from 'class-validator';
import { EnumCardType } from '../../../types/card';

export class CreateCardDto {
  @ApiProperty({
    example: 12,
    description: 'ID do jogador que recebeu o cartão',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  playerId: number;

  @ApiProperty({
    enum: EnumCardType,
    example: EnumCardType.YELLOW,
    description: 'Tipo do cartão',
  })
  @IsEnum(EnumCardType)
  type: EnumCardType;
}
