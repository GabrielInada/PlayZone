import { Module } from '@nestjs/common';
import { MatchReportService } from './match-report.service';
import { MatchReportController } from './match-report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchReport } from './entities/match-report.entity';
import { Card } from '../card/entities/card.entity';
import { Goal } from '../goal/entities/goal.entity';
import { Match } from '../match/entities/match.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([MatchReport, Match, Goal, Card, User]), UserModule],
  controllers: [MatchReportController],
  providers: [MatchReportService],
})
export class MatchReportModule {}
