import { EnumPlayerPosition } from "src/types/player";

export class CreatePlayerDto {
    name: string;

    shirtNumber: number;

    position: EnumPlayerPosition;

    createdAt: Date;
}
