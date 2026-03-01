import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { EnumMatchStatus } from 'src/types/match';

export class CreateMatchDto {
	@ApiProperty({ description: 'Data e hora da partida', example: '2026-03-10T19:00:00.000Z' })
	@Type(() => Date)
	@IsDate()
	date: Date;

	@ApiProperty({ description: 'ID do local da partida', example: 1 })
	@IsInt()
	@Min(1)
	locationId: number;

	@ApiProperty({ description: 'ID do time mandante', example: 1 })
	@IsInt()
	@Min(1)
	homeTeamId: number;

	@ApiProperty({ description: 'ID do time visitante', example: 2 })
	@IsInt()
	@Min(1)
	awayTeamId: number;

	@ApiPropertyOptional({ description: 'ID do delegado designado', example: 7 })
	@IsOptional()
	@IsInt()
	@Min(1)
	delegateId?: number;

	@ApiPropertyOptional({ enum: EnumMatchStatus, description: 'Status da partida (opcional)' })
	@IsOptional()
	@IsEnum(EnumMatchStatus)
	status?: EnumMatchStatus;
}
