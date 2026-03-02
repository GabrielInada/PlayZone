import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { StandingsService } from './standings.service';
import { MatchReport } from '../match-report/entities/match-report.entity';
import { EnumMatchReportStatus } from '../../types/match-report';
import { Standing } from './entities/standing.entity';

describe('StandingsService', () => {
  let service: StandingsService;
  let reportRepository: { find: jest.Mock };
  let standingRepository: {
    clear: jest.Mock;
    save: jest.Mock;
    create: jest.Mock;
    find: jest.Mock;
  };

  beforeEach(async () => {
    reportRepository = { find: jest.fn() };
    standingRepository = {
      clear: jest.fn(),
      save: jest.fn(),
      create: jest.fn((value) => value),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StandingsService,
        {
          provide: getRepositoryToken(MatchReport),
          useValue: reportRepository,
        },
        { provide: getRepositoryToken(Standing), useValue: standingRepository },
      ],
    }).compile();

    service = module.get<StandingsService>(StandingsService);
  });

  it('throws when create is called (unsupported operation)', () => {
    expect(() => service.create({} as any)).toThrow(BadRequestException);
  });

  it('returns ordered standings from validated reports', async () => {
    reportRepository.find.mockResolvedValue([
      {
        status: EnumMatchReportStatus.VALIDATED,
        homeScore: 2,
        awayScore: 0,
        match: {
          homeTeam: { id: 1, name: 'Team 1' },
          awayTeam: { id: 2, name: 'Team 2' },
        },
      },
      {
        status: EnumMatchReportStatus.VALIDATED,
        homeScore: 1,
        awayScore: 1,
        match: {
          homeTeam: { id: 3, name: 'Team 3' },
          awayTeam: { id: 1, name: 'Team 1' },
        },
      },
    ]);

    standingRepository.find.mockResolvedValue([
      {
        teamId: 1,
        teamName: 'Team 1',
        points: 4,
        wins: 1,
        draws: 1,
      },
    ]);

    const standings = await service.findAll();

    expect(standingRepository.clear).toHaveBeenCalled();
    expect(standingRepository.save).toHaveBeenCalled();
    expect(standingRepository.find).toHaveBeenCalled();
    expect(standings[0].teamId).toBe(1);
    expect(standings[0].points).toBe(4);
    expect(standings[0].wins).toBe(1);
    expect(standings[0].draws).toBe(1);
  });

  it('refreshPersistedStandings recalculates and persists standings', async () => {
    reportRepository.find.mockResolvedValue([
      {
        status: EnumMatchReportStatus.VALIDATED,
        homeScore: 2,
        awayScore: 0,
        match: {
          homeTeam: { id: 1, name: 'Team 1' },
          awayTeam: { id: 2, name: 'Team 2' },
        },
      },
      {
        status: EnumMatchReportStatus.VALIDATED,
        homeScore: 1,
        awayScore: 1,
        match: {
          homeTeam: { id: 3, name: 'Team 3' },
          awayTeam: { id: 1, name: 'Team 1' },
        },
      },
    ]);

    await service.refreshPersistedStandings();

    expect(standingRepository.clear).toHaveBeenCalled();
    expect(standingRepository.create).toHaveBeenCalled();
    expect(standingRepository.save).toHaveBeenCalled();
  });

  it('throws when update is called (unsupported operation)', () => {
    expect(() => service.update(1, {} as any)).toThrow(BadRequestException);
  });
});
