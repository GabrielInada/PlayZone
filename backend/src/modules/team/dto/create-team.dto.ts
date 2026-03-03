import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'Flamengo FC', description: 'Nome do time' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 1, description: 'ID do clube' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  clubId: number;

  @ApiProperty({ example: 'Tite', description: 'Nome do técnico' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  coachName: string;
}
