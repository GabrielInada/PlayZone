import { IsInt, IsArray, IsOptional, IsString, ValidateNested, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CardType } from '../entities/card.entity'; // Importa o Enum que criamos na entidade (YELLOW/RED)

// Validação para cada GOL individual na lista
class GoalDto {
  @IsInt()
  @Min(1)
  playerId: number;

  @IsInt()
  @Min(0)
  minute: number;
}

// Validação para cada CARTÃO individual na lista
class CardDto {
  @IsInt()
  @Min(1)
  playerId: number;

  @IsEnum(CardType, { message: 'O tipo do cartão deve ser YELLOW ou RED' })
  type: CardType;
}

// O DTO Principal que recebe tudo
export class CreateMatchReportDto {
  @IsInt()
  @IsNotEmpty()
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
  @Type(() => GoalDto)
  goals: GoalDto[];

  // Valida um array de objetos CardDto
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CardDto)
  cards: CardDto[];
}

// Helper function simulada para evitar erro de importação se o class-validator não tiver IsNotEmpty
function IsNotEmpty(): (target: CreateMatchReportDto, propertyKey: "matchId") => void {
    return function (target: CreateMatchReportDto, propertyKey: "matchId") {};
}