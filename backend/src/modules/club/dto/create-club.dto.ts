import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateClubDto {
	@ApiProperty({ example: 'Clube Atlético UFRA', description: 'Nome do clube' })
	@IsString()
	name: string;

	@ApiPropertyOptional({
		example: 'https://cdn.example.com/badges/clube-atletico-ufra.png',
		description: 'URL da imagem do escudo do clube',
	})
	@IsOptional()
	@IsUrl()
	badgeImage?: string;

	@ApiProperty({ example: 7, description: 'ID do usuário dono do perfil do clube' })
	@IsInt()
	@Min(1)
	ownerUserId: number;
}
