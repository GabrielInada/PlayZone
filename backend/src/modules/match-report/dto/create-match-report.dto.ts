import { Type } from "class-transformer";
import { IsOptional, ValidateNested, Min, IsArray, IsInt, IsString } from "class-validator";
import { CreateCardDto } from "src/modules/card/dto/create-card.dto";
import { CreateGoalDto } from "src/modules/goal/dto/create-goal.dto";


export class CreateMatchReportDto {
    @IsInt()
    matchId: number;

    @IsInt()
    @Min(0)
    homeScore: number;

    @IsInt()
    @Min(0)
    awayScore: number;
    
    @IsString()
    @IsOptional()
    observations?: string;

    // Valida um array de objetos GoalDto
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateGoalDto)
    goals: CreateGoalDto[];

    // Valida um array de objetos CardDto
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateCardDto)
    cards: CreateCardDto[];
}
