import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { PlayerService } from './player.service';
import { Player } from './entities/player.entity';
import { Team } from '../team/entities/team.entity';

describe('PlayerService', () => {
  let service: PlayerService;
  let playerRepository: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    preload: jest.Mock;
    remove: jest.Mock;
  };
  let teamRepository: { findOne: jest.Mock };

  beforeEach(async () => {
    playerRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      preload: jest.fn(),
      remove: jest.fn(),
    };

    teamRepository = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        { provide: getRepositoryToken(Player), useValue: playerRepository },
        { provide: getRepositoryToken(Team), useValue: teamRepository },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
  });

  it('throws 404 when team does not exist on create', async () => {
    teamRepository.findOne.mockResolvedValue(null);

    await expect(
      service.create({ name: 'Ronaldo', teamId: 999 } as any),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('creates player when team exists', async () => {
    const created = { id: 1, name: 'Ronaldo', teamId: 7 };

    teamRepository.findOne.mockResolvedValue({ id: 7 });
    playerRepository.create.mockReturnValue(created);
    playerRepository.save.mockResolvedValue(created);

    const result = await service.create({ name: 'Ronaldo', teamId: 7 } as any);

    expect(playerRepository.create).toHaveBeenCalled();
    expect(playerRepository.save).toHaveBeenCalledWith(created);
    expect(result).toEqual(created);
  });

  it('throws 404 when player is not found in findOne', async () => {
    playerRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(123)).rejects.toBeInstanceOf(HttpException);
  });
});
