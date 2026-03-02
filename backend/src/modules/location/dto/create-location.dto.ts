import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

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

	@ApiPropertyOptional({
		example: 1200,
		description: 'Capacidade máxima de pessoas no local',
	})
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	capacity?: number;

	@ApiPropertyOptional({
		example: 'https://cdn.example.com/locations/ginasio-ufra.jpg',
		description:
			'URL ou data URI da imagem do local (limite configurável por LOCATION_IMAGE_URL_MAX_LENGTH; padrão: 200000 caracteres)',
	})
	@IsOptional()
	@IsString()
	imageUrl?: string;
}
