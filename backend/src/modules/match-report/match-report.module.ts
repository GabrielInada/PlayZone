import { Module } from '@nestjs/common';
import { MatchReportService } from './match-report.service';
import { MatchReportController } from './match-report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchReport } from './entities/match-report.entity';
import { Card } from '../card/entities/card.entity';
import { Goal } from '../goal/entities/goal.entity';
import { Match } from '../match/entities/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchReport, Match, Goal, Card])],
  controllers: [MatchReportController],
  providers: [MatchReportService],
})
export class MatchReportModule {}
