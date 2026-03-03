import 'dotenv/config';
import dataSource from './data-source';
import { User } from '../modules/user/entities/user.entity';
import { Club } from '../modules/club/entities/club.entity';
import { Team } from '../modules/team/entities/team.entity';
import { Player } from '../modules/player/entities/player.entity';
import { Location } from '../modules/location/entities/location.entity';
import { Match } from '../modules/match/entities/match.entity';
import { MatchReport } from '../modules/match-report/entities/match-report.entity';
import { Goal } from '../modules/goal/entities/goal.entity';
import { Card } from '../modules/card/entities/card.entity';
import { Standing } from '../modules/standings/entities/standing.entity';
import { TournamentKnockout } from '../modules/tournament-knockout/entities/tournament-knockout.entity';
import { In, Like } from 'typeorm';

async function run() {
  await dataSource.initialize();

  const userRepo = dataSource.getRepository(User);
  const clubRepo = dataSource.getRepository(Club);
  const teamRepo = dataSource.getRepository(Team);
  const playerRepo = dataSource.getRepository(Player);
  const locationRepo = dataSource.getRepository(Location);
  const matchRepo = dataSource.getRepository(Match);
  const reportRepo = dataSource.getRepository(MatchReport);
  const goalRepo = dataSource.getRepository(Goal);
  const cardRepo = dataSource.getRepository(Card);
  const standingRepo = dataSource.getRepository(Standing);
  const knockoutRepo = dataSource.getRepository(TournamentKnockout);

  const demoTeams = await teamRepo.find({ where: { name: Like('Time Demo %') } });
  const demoTeamIds = demoTeams.map((team) => team.id);

  const matchesToDelete =
    demoTeamIds.length > 0
      ? await matchRepo
          .createQueryBuilder('match')
          .where('match."homeTeamId" IN (:...teamIds)', { teamIds: demoTeamIds })
          .orWhere('match."awayTeamId" IN (:...teamIds)', { teamIds: demoTeamIds })
          .getMany()
      : [];

  const matchIds = matchesToDelete.map((match) => match.id);
  const reportsToDelete =
    matchIds.length > 0
      ? await reportRepo.find({
          where: { matchId: In(matchIds) },
        })
      : [];
  const reportIds = reportsToDelete.map((report) => report.id);

  const demoKnockoutRows = await knockoutRepo.find({
    where: { tournamentName: Like('Demo Knockout %') },
  });

  if (demoKnockoutRows.length > 0) {
    await knockoutRepo.remove(demoKnockoutRows);
  }

  if (reportIds.length > 0) {
    await goalRepo.delete({ matchReportId: In(reportIds) });
    await cardRepo.delete({ matchReportId: In(reportIds) });
    await reportRepo.delete({ id: In(reportIds) });
  }

  if (matchIds.length > 0) {
    await matchRepo.delete({ id: In(matchIds) });
  }

  if (demoTeamIds.length > 0) {
    await standingRepo.delete({ teamId: In(demoTeamIds) });
    await playerRepo.delete({ teamId: In(demoTeamIds) });
    await teamRepo.delete({ id: In(demoTeamIds) });
  }

  const demoClubs = await clubRepo.find({ where: { name: Like('Clube Demo %') } });
  const demoClubIds = demoClubs.map((club) => club.id);
  if (demoClubIds.length > 0) {
    await clubRepo.delete({ id: In(demoClubIds) });
  }

  const locationsDeleteResult = await locationRepo
    .createQueryBuilder()
    .delete()
    .from(Location)
    .where('name LIKE :norte', { norte: 'Arena Norte (%)' })
    .orWhere('name LIKE :sul', { sul: 'Arena Sul (%)' })
    .execute();

  await userRepo
    .createQueryBuilder()
    .delete()
    .from(User)
    .where('email LIKE :delegate', { delegate: 'demo.delegate.%@playzone.local' })
    .orWhere('email LIKE :owner', { owner: 'demo.owner.%@playzone.local' })
    .execute();

  console.log('Demo seed cleanup concluído com sucesso.');
  console.log({
    removed: {
      knockoutRows: demoKnockoutRows.length,
      reports: reportIds.length,
      matches: matchIds.length,
      teams: demoTeamIds.length,
      clubs: demoClubIds.length,
      locations: locationsDeleteResult.affected ?? 0,
    },
  });

  await dataSource.destroy();
}

run().catch(async (err) => {
  console.error('Falha ao executar cleanup demo:', err);
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
  process.exit(1);
});
