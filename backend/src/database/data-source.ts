import { DataSource } from 'typeorm';
import { Player } from '../modules/player/entities/player.entity';
import { Team } from '../modules/team/entities/team.entity';
import { Match } from '../modules/match/entities/match.entity';
import { User } from '../modules/user/entities/user.entity';
import { MatchReport } from '../modules/match-report/entities/match-report.entity';
import { Goal } from '../modules/goal/entities/goal.entity';
import { Card } from '../modules/card/entities/card.entity';
import { Club } from '../modules/club/entities/club.entity';
import configuration from '../config/configuration';

const { dbUrl } = configuration();

if (!dbUrl) {
  throw new Error('DATABASE_URL is required to run TypeORM migrations');
}

export default new DataSource({
  type: 'postgres',
  url: dbUrl,
  entities: [Player, Team, Match, User, MatchReport, Goal, Card, Club],
  migrations: ['src/database/migrations/*{.ts,.js}', 'dist/database/migrations/*{.ts,.js}'],
  synchronize: false,
});
