import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayerDto } from './create-player.dto';
import { EnumPlayerPosition } from 'src/types/player';

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {
    name: string;

    shirtNumber: number;

    position: EnumPlayerPosition;

    updatedAt: Date | null;
}
