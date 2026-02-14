import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchReportsService } from '../../modules/match-reports/match-reports.service';
import { MatchReportsController } from '../../modules/match-reports/match-reports.controller';
import { MatchReport } from '../../modules/match-reports/entities/match-report.entity';
import { Match } from '../../modules/matches/entities/match.entity';
import { Goal } from '../../modules/match-reports/entities/goal.entity';
import { Card } from '../../modules/match-reports/entities/card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchReport, Match, Goal, Card])],
  controllers: [MatchReportsController],
  providers: [MatchReportsService],
})
export class MatchReportsModule {}