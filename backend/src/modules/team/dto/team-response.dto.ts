import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class TeamResponseDto {
  @ApiProperty({ example: 1, minimum: 1 })
  @Expose()
  @Type(() => Number)
  id: number;

  @ApiProperty({ example: 'Flamengo FC' })
  @Expose()
  name: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @Expose()
  @Type(() => Number)
  clubId: number;

  @ApiProperty({ example: 'Tite' })
  @Expose()
  coachName: string;

  @ApiProperty({
    example: '2026-02-27T12:00:00.000Z',
    format: 'date-time',
  })
  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    example: '2026-02-27T12:00:00.000Z',
    format: 'date-time',
  })
  @Expose()
  @Type(() => Date)
  updatedAt: Date;
}
