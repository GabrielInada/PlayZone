import { ApiProperty } from '@nestjs/swagger';

export class TeamResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Flamengo FC' })
  name: string;

  @ApiProperty({ example: 1 })
  clubId: number;

  @ApiProperty({ example: 'Tite' })
  coachName: string;

  @ApiProperty({ example: '2026-02-27T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-27T12:00:00.000Z' })
  updatedAt: Date;
}
