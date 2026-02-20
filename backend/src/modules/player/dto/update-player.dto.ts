import { IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayerDto } from './create-player.dto';

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {
    @IsOptional()
    updatedAt?: Date | null;
}
