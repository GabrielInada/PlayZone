import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
    @ApiProperty({ example: 'Flamengo FC', description: 'Team name' })
    @IsString()
    name: string;

    @ApiProperty({ example: 1, description: 'Club ID' })
    @IsNumber()
    clubId: number;

    @ApiProperty({ example: 'Tite', description: 'Coach name' })
    @IsString()
    coachName: string;

    @ApiProperty({ required: false, description: 'Creation date (auto-generated if not provided)' })
    @IsOptional()
    createdAt?: Date;

    @ApiProperty({ required: false, description: 'Update date (auto-generated if not provided)' })
    @IsOptional()
    updatedAt?: Date;
}
