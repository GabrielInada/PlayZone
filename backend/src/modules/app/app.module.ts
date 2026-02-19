import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'src/config/configuration';
import { Player } from '../player/entities/player.entity';
import { PlayerModule } from '../player/player.module';
import { TeamModule } from '../team/team.module';
import { Team } from '../team/entities/team.entity';
import { Match } from '../match/entities/match.entity';
import { MatchModule } from '../match/match.module';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { Card } from '../card/entities/card.entity';
import { Goal } from '../goal/entities/goal.entity';
import { MatchReport } from '../match-report/entities/match-report.entity';
import { MatchReportModule } from '../match-report/match-report.module';
import { CardModule } from '../card/card.module';
import { GoalModule } from '../goal/goal.module';
import { Club } from '../club/entities/club.entity';
import { ClubModule } from '../club/club.module';
import { SelfConsultModule } from 'src/tasks/self-consult/self-consult.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SelfConsultModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('dbUrl');
        return {
          type: 'postgres',
          url: dbUrl,
          entities: [Player],
          synchronize: true, // Não vai ter migrations por enquanto
        };
      },
    }),
    PlayerModule, TeamModule, MatchModule, UserModule, MatchReportModule, GoalModule, CardModule, ClubModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}