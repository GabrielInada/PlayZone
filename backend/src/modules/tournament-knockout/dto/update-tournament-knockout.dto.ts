import { PartialType } from '@nestjs/mapped-types';
import { CreateTournamentKnockoutDto } from './create-tournament-knockout.dto';

export class UpdateTournamentKnockoutDto extends PartialType(
  CreateTournamentKnockoutDto,
) {}
