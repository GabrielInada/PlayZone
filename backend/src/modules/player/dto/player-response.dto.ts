import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { EnumPlayerPosition } from '../../../types/player';

export class PlayerResponseDto {
  @ApiProperty({ example: 1, minimum: 1 })
  @Expose()
  @Type(() => Number)
  id: number;

  @ApiProperty({ example: 'João Silva' })
  @Expose()
  name: string;

  @ApiProperty({ example: 10, minimum: 1 })
  @Expose()
  @Type(() => Number)
  shirtNumber: number;

  @ApiProperty({
    enum: EnumPlayerPosition,
    example: EnumPlayerPosition.GOLEIRO,
  })
  @Expose()
  position: EnumPlayerPosition;

  @ApiProperty({ example: 1, minimum: 1 })
  @Expose()
  @Type(() => Number)
  teamId: number;

  @ApiProperty({
    example: '2026-02-27T12:00:00.000Z',
    format: 'date-time',
  })
  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    example: '2026-02-27T12:00:00.000Z',
    nullable: true,
    format: 'date-time',
  })
  @Expose()
  @Type(() => Date)
  updatedAt: Date | null;
}
