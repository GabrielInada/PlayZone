import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
	@ApiProperty({ example: 'Ginásio da UFRA', description: 'Nome do local da partida' })
	@IsString()
	name: string;

	@ApiPropertyOptional({ example: 'Av. Perimetral, 2501', description: 'Endereço do local' })
	@IsOptional()
	@IsString()
	address?: string;

	@ApiPropertyOptional({ example: 'Belém', description: 'Cidade do local' })
	@IsOptional()
	@IsString()
	city?: string;

	@ApiPropertyOptional({ example: 'PA', description: 'Estado do local' })
	@IsOptional()
	@IsString()
	state?: string;
}
