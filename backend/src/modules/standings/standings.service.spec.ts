import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { StandingsService } from './standings.service';
import { MatchReport } from '../match-report/entities/match-report.entity';
import { EnumMatchReportStatus } from '../../types/match-report';

describe('StandingsService', () => {
  let service: StandingsService;
  let reportRepository: { find: jest.Mock };

  beforeEach(async () => {
    reportRepository = { find: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StandingsService,
        { provide: getRepositoryToken(MatchReport), useValue: reportRepository },
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

    const standings = await service.findAll();

    expect(standings[0].id).toBe(1);
    expect(standings[0].points).toBe(4);
    expect(standings[0].wins).toBe(1);
    expect(standings[0].draws).toBe(1);
  });

  it('throws when update is called (unsupported operation)', () => {
    expect(() => service.update(1, {} as any)).toThrow(BadRequestException);
  });
});
