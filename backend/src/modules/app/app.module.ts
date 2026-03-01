import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../../config/configuration';
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
import { Location } from '../location/entities/location.entity';
import { LocationModule } from '../location/location.module';
import { SelfConsultModule } from '../../tasks/self-consult/self-consult.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from '../auth/auth.module';
import { join } from 'path';

@Module({
  imports: [
    ScheduleModule.forRoot(), SelfConsultModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('dbUrl');
        const dbSynchronizeEnv = configService.get<string>('dbSynchronize');
        const dbMigrationsRunEnv = configService.get<string>('dbMigrationsRun');
        const isProduction = configService.get<string>('nodeEnv') === 'production';
        const isVercel = Boolean(configService.get<boolean>('isVercel'));

        // Por padrão, synchronize é true em ambientes de desenvolvimento e false em produção/vercel, a menos que seja explicitamente configurado via DB_SYNCHRONIZE
        const synchronize = dbSynchronizeEnv
          ? dbSynchronizeEnv === 'true' || dbSynchronizeEnv === '1'
          : !(isProduction || isVercel);

        const migrationsRun = dbMigrationsRunEnv
          ? dbMigrationsRunEnv === 'true' || dbMigrationsRunEnv === '1'
          : false;

        return {
          type: 'postgres',
          url: dbUrl,
          entities: [Player, Team, Match, User, MatchReport, Goal, Card, Club, Location],
          migrations: [join(__dirname, '../../database/migrations/*{.ts,.js}')],
          migrationsRun,
          synchronize,
        };
      },
    }),
    PlayerModule, TeamModule, MatchModule, UserModule, MatchReportModule, GoalModule, CardModule, ClubModule, LocationModule, AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}