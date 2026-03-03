import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'Flamengo FC', description: 'Team name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 1, description: 'Club ID' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  clubId: number;

  @ApiProperty({ example: 'Tite', description: 'Coach name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  coachName: string;
}
