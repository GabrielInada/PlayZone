import { EnumCardType } from "src/types/card";

export class CreateCardDto {
    playerId: number;
    
    type: EnumCardType;
}
