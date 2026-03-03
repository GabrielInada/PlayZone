import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTournamentDto {
	@ApiProperty({
		example: 'Copa PlayZone 2026',
		description: 'Nome do campeonato',
	})
	@IsString()
	@IsNotEmpty()
	@MaxLength(120)
	name: string;
}
