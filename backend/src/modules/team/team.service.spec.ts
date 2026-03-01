import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { TeamService } from './team.service';
import { Team } from './entities/team.entity';
import { Club } from '../club/entities/club.entity';

describe('TeamService', () => {
  let service: TeamService;
  let teamRepository: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    preload: jest.Mock;
    remove: jest.Mock;
  };
  let clubRepository: { findOne: jest.Mock };

  beforeEach(async () => {
    teamRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      preload: jest.fn(),
      remove: jest.fn(),
    };

    clubRepository = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        { provide: getRepositoryToken(Team), useValue: teamRepository },
        { provide: getRepositoryToken(Club), useValue: clubRepository },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
  });

  it('throws 404 when club does not exist on create', async () => {
    clubRepository.findOne.mockResolvedValue(null);

    await expect(
      service.create({ name: 'Time A', clubId: 111 } as any),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('creates team when club exists', async () => {
    const created = { id: 1, name: 'Time A', clubId: 8 };

    clubRepository.findOne.mockResolvedValue({ id: 8 });
    teamRepository.create.mockReturnValue(created);
    teamRepository.save.mockResolvedValue(created);

    const result = await service.create({ name: 'Time A', clubId: 8 } as any);

    expect(teamRepository.create).toHaveBeenCalled();
    expect(teamRepository.save).toHaveBeenCalledWith(created);
    expect(result).toEqual(created);
  });

  it('throws 409 when trying to remove team with players linked', async () => {
    teamRepository.findOne.mockResolvedValue({
      id: 3,
      players: [{ id: 1 }, { id: 2 }],
      homeMatches: [],
      awayMatches: [],
      club: null,
    });

    await expect(service.remove(3)).rejects.toBeInstanceOf(HttpException);
  });
});
