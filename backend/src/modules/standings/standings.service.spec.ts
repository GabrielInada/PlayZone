import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StandingsService } from './standings.service';
import { MatchReport } from '../match-report/entities/match-report.entity';

describe('StandingsService', () => {
  let service: StandingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StandingsService,
        { provide: getRepositoryToken(MatchReport), useValue: {} },
      ],
    }).compile();

    service = module.get<StandingsService>(StandingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
