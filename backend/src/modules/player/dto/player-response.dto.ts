import { ApiProperty } from '@nestjs/swagger';
import { EnumPlayerPosition } from '../../../types/player';

export class PlayerResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'João Silva' })
  name: string;

  @ApiProperty({ example: 10 })
  shirtNumber: number;

  @ApiProperty({ enum: EnumPlayerPosition, example: EnumPlayerPosition.GOLEIRO })
  position: EnumPlayerPosition;

  @ApiProperty({ example: 1 })
  teamId: number;

  @ApiProperty({ example: '2026-02-27T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-27T12:00:00.000Z', nullable: true })
  updatedAt: Date | null;
}
