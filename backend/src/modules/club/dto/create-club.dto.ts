import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateClubDto {
  @ApiProperty({ example: 'UFRA Athletic Club', description: 'Nome do clube' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/badges/ufra-athletic-club.png',
    description: 'URL da imagem do escudo do clube',
  })
  @IsOptional()
  @IsUrl()
  badgeImage?: string;

  @ApiProperty({
    example: 7,
    description: 'ID do usuário dono deste perfil de clube',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  ownerUserId: number;
}
