import 'dotenv/config';
import * as bcrypt from 'bcryptjs';
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
import { EnumUserRole, EnumUserType } from '../types/user';
import { EnumPlayerPosition } from '../types/player';
import { EnumMatchStatus } from '../types/match';
import { EnumMatchReportStatus } from '../types/match-report';
import { EnumCardType } from '../types/card';

type StandingAccumulator = {
  teamId: number;
  teamName: string;
  points: number;
  games: number;
  wins: number;
  draws: number;
  losses: number;
  gf: number;
  ga: number;
  gd: number;
};

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

  const runId = Date.now();
  const tournamentName = `Demo Knockout ${runId}`;
  const now = new Date();
  const hash = await bcrypt.hash('123456', 10);

  const delegate = await userRepo.save(
    userRepo.create({
      name: `Delegado Demo ${runId}`,
      email: `demo.delegate.${runId}@playzone.local`,
      password: hash,
      role: EnumUserRole.USER,
      type: EnumUserType.DELEGADO,
      createdAt: now,
      updatedAt: now,
    }),
  );

  const owners = await Promise.all(
    ['A', 'B', 'C', 'D'].map((suffix) =>
      userRepo.save(
        userRepo.create({
          name: `Owner ${suffix} ${runId}`,
          email: `demo.owner.${suffix.toLowerCase()}.${runId}@playzone.local`,
          password: hash,
          role: EnumUserRole.USER,
          type: EnumUserType.CLUBE,
          createdAt: now,
          updatedAt: now,
        }),
      ),
    ),
  );

  const clubs = await Promise.all(
    owners.map((owner, index) =>
      clubRepo.save(
        clubRepo.create({
          name: `Clube Demo ${index + 1} (${runId})`,
          ownerUserId: owner.id,
          owner,
          createdAt: now,
          updatedAt: now,
        }),
      ),
    ),
  );

  const teams = await Promise.all(
    clubs.map((club, index) =>
      teamRepo.save(
        teamRepo.create({
          name: `Time Demo ${index + 1}`,
          clubId: club.id,
          club,
          coachName: `Técnico ${index + 1}`,
          createdAt: now,
          updatedAt: now,
        }),
      ),
    ),
  );

  const allPlayers: Player[] = [];
  for (const [index, team] of teams.entries()) {
    const base = index * 10;
    const teamPlayers = await Promise.all([
      playerRepo.save(
        playerRepo.create({
          name: `Goleiro T${index + 1}`,
          shirtNumber: base + 1,
          position: EnumPlayerPosition.GOLEIRO,
          team,
          teamId: team.id,
          createdAt: now,
          updatedAt: now,
        }),
      ),
      playerRepo.save(
        playerRepo.create({
          name: `Ala T${index + 1}`,
          shirtNumber: base + 7,
          position: EnumPlayerPosition.ALA,
          team,
          teamId: team.id,
          createdAt: now,
          updatedAt: now,
        }),
      ),
      playerRepo.save(
        playerRepo.create({
          name: `Pivô T${index + 1}`,
          shirtNumber: base + 9,
          position: EnumPlayerPosition.PIVO,
          team,
          teamId: team.id,
          createdAt: now,
          updatedAt: now,
        }),
      ),
    ]);

    allPlayers.push(...teamPlayers);
  }

  const locations = await Promise.all([
    locationRepo.save(
      locationRepo.create({
        name: `Arena Norte (${runId})`,
        city: 'Belém',
        state: 'PA',
        capacity: 800,
        createdAt: now,
        updatedAt: now,
      }),
    ),
    locationRepo.save(
      locationRepo.create({
        name: `Arena Sul (${runId})`,
        city: 'Belém',
        state: 'PA',
        capacity: 600,
        createdAt: now,
        updatedAt: now,
      }),
    ),
  ]);

  const semifinal1 = await matchRepo.save(
    matchRepo.create({
      date: new Date(now.getTime() + 2 * 60 * 60 * 1000),
      locationId: locations[0].id,
      location: locations[0],
      status: EnumMatchStatus.FINISHED,
      homeTeam: teams[0],
      awayTeam: teams[1],
      delegateId: delegate.id,
      delegate,
    }),
  );

  const semifinal2 = await matchRepo.save(
    matchRepo.create({
      date: new Date(now.getTime() + 3 * 60 * 60 * 1000),
      locationId: locations[1].id,
      location: locations[1],
      status: EnumMatchStatus.FINISHED,
      homeTeam: teams[2],
      awayTeam: teams[3],
      delegateId: delegate.id,
      delegate,
    }),
  );

  const finalMatch = await matchRepo.save(
    matchRepo.create({
      date: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      locationId: locations[0].id,
      location: locations[0],
      status: EnumMatchStatus.SCHEDULED,
      homeTeam: teams[0],
      awayTeam: teams[2],
      delegateId: delegate.id,
      delegate,
    }),
  );

  const report1 = await reportRepo.save(
    reportRepo.create({
      matchId: semifinal1.id,
      match: semifinal1,
      homeScore: 2,
      awayScore: 1,
      observations: 'Semifinal 1 - jogo equilibrado',
      status: EnumMatchReportStatus.VALIDATED,
      adminNote: null,
    }),
  );

  const report2 = await reportRepo.save(
    reportRepo.create({
      matchId: semifinal2.id,
      match: semifinal2,
      homeScore: 1,
      awayScore: 3,
      observations: 'Semifinal 2 - visitante dominante',
      status: EnumMatchReportStatus.VALIDATED,
      adminNote: null,
    }),
  );

  const team1Players = allPlayers.filter((p) => p.teamId === teams[0].id);
  const team2Players = allPlayers.filter((p) => p.teamId === teams[1].id);
  const team3Players = allPlayers.filter((p) => p.teamId === teams[2].id);
  const team4Players = allPlayers.filter((p) => p.teamId === teams[3].id);

  await goalRepo.save([
    goalRepo.create({ minute: 11, playerId: team1Players[1].id, matchReportId: report1.id }),
    goalRepo.create({ minute: 34, playerId: team2Players[2].id, matchReportId: report1.id }),
    goalRepo.create({ minute: 39, playerId: team1Players[2].id, matchReportId: report1.id }),
    goalRepo.create({ minute: 5, playerId: team3Players[2].id, matchReportId: report2.id }),
    goalRepo.create({ minute: 20, playerId: team4Players[1].id, matchReportId: report2.id }),
    goalRepo.create({ minute: 29, playerId: team4Players[2].id, matchReportId: report2.id }),
    goalRepo.create({ minute: 37, playerId: team4Players[2].id, matchReportId: report2.id }),
  ]);

  await cardRepo.save([
    cardRepo.create({ type: EnumCardType.YELLOW, playerId: team1Players[0].id, matchReportId: report1.id }),
    cardRepo.create({ type: EnumCardType.YELLOW, playerId: team3Players[1].id, matchReportId: report2.id }),
    cardRepo.create({ type: EnumCardType.RED, playerId: team4Players[0].id, matchReportId: report2.id }),
  ]);

  const standingsMap = new Map<number, StandingAccumulator>();
  const upsertStats = (teamId: number, teamName: string, gf: number, ga: number) => {
    if (!standingsMap.has(teamId)) {
      standingsMap.set(teamId, {
        teamId,
        teamName,
        points: 0,
        games: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        gf: 0,
        ga: 0,
        gd: 0,
      });
    }
    const row = standingsMap.get(teamId);
    if (!row) return;
    row.games += 1;
    row.gf += gf;
    row.ga += ga;
    row.gd = row.gf - row.ga;
    if (gf > ga) {
      row.points += 3;
      row.wins += 1;
    } else if (gf === ga) {
      row.points += 1;
      row.draws += 1;
    } else {
      row.losses += 1;
    }
  };

  upsertStats(teams[0].id, teams[0].name, 2, 1);
  upsertStats(teams[1].id, teams[1].name, 1, 2);
  upsertStats(teams[2].id, teams[2].name, 1, 3);
  upsertStats(teams[3].id, teams[3].name, 3, 1);

  const standingsRows = Array.from(standingsMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.gd - a.gd;
  });

  await standingRepo.upsert(
    standingsRows.map((row, index) => ({
      ...row,
      position: index + 1,
      lastUpdatedAt: now,
    })),
    ['teamId'],
  );

  await knockoutRepo.save([
    knockoutRepo.create({
      tournamentName,
      stage: 'SEMI_FINAL',
      roundOrder: 1,
      slot: 1,
      matchId: semifinal1.id,
      winnerTeamId: teams[0].id,
      isDecided: true,
      notes: 'Classificado via súmula validada',
    }),
    knockoutRepo.create({
      tournamentName,
      stage: 'SEMI_FINAL',
      roundOrder: 1,
      slot: 2,
      matchId: semifinal2.id,
      winnerTeamId: teams[3].id,
      isDecided: true,
      notes: 'Classificado via súmula validada',
    }),
    knockoutRepo.create({
      tournamentName,
      stage: 'FINAL',
      roundOrder: 2,
      slot: 1,
      matchId: finalMatch.id,
      winnerTeamId: null,
      isDecided: false,
      notes: 'Final agendada',
    }),
  ]);

  console.log('Demo seed concluído com sucesso.');
  console.log({
    runId,
    tournamentName,
    created: {
      users: 5,
      clubs: 4,
      teams: 4,
      players: allPlayers.length,
      locations: 2,
      matches: 3,
      reports: 2,
      standingsRows: standingsRows.length,
      knockoutRows: 3,
    },
  });

  await dataSource.destroy();
}

run().catch(async (err) => {
  console.error('Falha ao executar seed demo:', err);
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
  process.exit(1);
});
