import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MatchService } from './match.service';
import { Match } from './entities/match.entity';
import { Team } from '../team/entities/team.entity';
import { User } from '../user/entities/user.entity';
import { Location } from '../location/entities/location.entity';

describe('MatchService', () => {
  let service: MatchService;
  let matchRepository: {
    create: jest.Mock;
    save: jest.Mock;
    findOne: jest.Mock;
    find: jest.Mock;
    merge: jest.Mock;
    remove: jest.Mock;
  };
  let teamRepository: { findOne: jest.Mock };
  let userRepository: { findOne: jest.Mock };
  let locationRepository: { findOne: jest.Mock };

  beforeEach(async () => {
    matchRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      merge: jest.fn(),
      remove: jest.fn(),
    };

    teamRepository = { findOne: jest.fn() };
    userRepository = { findOne: jest.fn() };
    locationRepository = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        { provide: getRepositoryToken(Match), useValue: matchRepository },
        { provide: getRepositoryToken(Team), useValue: teamRepository },
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: getRepositoryToken(Location), useValue: locationRepository },
      ],
    }).compile();

    service = module.get<MatchService>(MatchService);
  });

  it('throws 400 when home and away teams are the same', async () => {
    await expect(
      service.create({
        date: new Date('2026-03-10T19:00:00.000Z'),
        locationId: 1,
        homeTeamId: 5,
        awayTeamId: 5,
      } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws 404 when teams are not found', async () => {
    teamRepository.findOne.mockResolvedValue(null);
    locationRepository.findOne.mockResolvedValue({ id: 1 });

    await expect(
      service.create({
        date: new Date('2026-03-10T19:00:00.000Z'),
        locationId: 1,
        homeTeamId: 1,
        awayTeamId: 2,
      } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('creates and saves a match when all relations exist', async () => {
    const homeTeam = { id: 1 };
    const awayTeam = { id: 2 };
    const location = { id: 3 };
    const persisted = { id: 10 };

    teamRepository.findOne
      .mockResolvedValueOnce(homeTeam)
      .mockResolvedValueOnce(awayTeam);
    locationRepository.findOne.mockResolvedValue(location);
    matchRepository.create.mockReturnValue({
      homeTeam,
      awayTeam,
      location,
      locationId: 3,
    });
    matchRepository.save.mockResolvedValue(persisted);

    const result = await service.create({
      date: new Date('2026-03-10T19:00:00.000Z'),
      locationId: 3,
      homeTeamId: 1,
      awayTeamId: 2,
    } as any);

    expect(matchRepository.create).toHaveBeenCalled();
    expect(matchRepository.save).toHaveBeenCalled();
    expect(result).toEqual(persisted);
  });
});
