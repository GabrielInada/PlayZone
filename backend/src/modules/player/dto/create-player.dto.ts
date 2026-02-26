import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EnumPlayerPosition } from "src/types/player";

export class CreatePlayerDto {
    @ApiProperty({ example: 'João Silva', description: 'Player name' })
    @IsString()
    name: string;

    @ApiProperty({ example: 10, description: 'Player shirt number' })
    @IsNumber()
    shirtNumber: number;

    @ApiProperty({ enum: EnumPlayerPosition, example: 'goleiro', description: 'Player position' })
    @IsEnum(EnumPlayerPosition)
    position: EnumPlayerPosition;

    @ApiProperty({ example: 1, description: 'Team ID' })
    @IsNumber()
    teamId: number;

    @ApiProperty({ required: false, description: 'Creation date (auto-generated if not provided)' })
    @IsOptional()
    createdAt?: Date;
}
