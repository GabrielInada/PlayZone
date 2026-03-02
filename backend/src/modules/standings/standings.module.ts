import { Module } from '@nestjs/common';
import { StandingsService } from './standings.service';
import { StandingsController } from './standings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchReport } from '../match-report/entities/match-report.entity';
import { Standing } from './entities/standing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchReport, Standing])],
  controllers: [StandingsController],
  providers: [StandingsService],
})
export class StandingsModule {}
