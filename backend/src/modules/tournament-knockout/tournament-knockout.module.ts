import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentKnockoutService } from './tournament-knockout.service';
import { TournamentKnockoutController } from './tournament-knockout.controller';
import { TournamentKnockout } from './entities/tournament-knockout.entity';
import { Match } from '../match/entities/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TournamentKnockout, Match])],
  controllers: [TournamentKnockoutController],
  providers: [TournamentKnockoutService],
})
export class TournamentKnockoutModule {}
