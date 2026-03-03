import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
	@ApiPropertyOptional({ example: 'Gabriel Inada' })
	@IsOptional()
	@IsString()
	@MinLength(2)
	@MaxLength(120)
	name?: string;
}
