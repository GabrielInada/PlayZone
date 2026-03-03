import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({
    example: 'UFRA Gymnasium',
    description: 'Nome do local da partida',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({
    example: 'Av. Perimetral, 2501',
    description: 'Endereço do local',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @ApiPropertyOptional({
    example: 1200,
    description: 'Capacidade máxima do local',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/locations/ginasio-ufra.jpg',
    description:
      'Venue image URL or data URI (configurable limit via LOCATION_IMAGE_URL_MAX_LENGTH; default: 200000 characters)',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
