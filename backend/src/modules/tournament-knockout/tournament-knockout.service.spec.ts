import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TournamentKnockoutService } from './tournament-knockout.service';
import { TournamentKnockout } from './entities/tournament-knockout.entity';
import { Match } from '../match/entities/match.entity';
import { Tournament } from '../tournament/entities/tournament.entity';

describe('TournamentKnockoutService', () => {
  let service: TournamentKnockoutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TournamentKnockoutService,
        {
          provide: getRepositoryToken(TournamentKnockout),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(Match),
          useValue: { findOne: jest.fn() },
        },
        {
          provide: getRepositoryToken(Tournament),
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<TournamentKnockoutService>(TournamentKnockoutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
