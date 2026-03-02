import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { ClubService } from './club.service';
import { Club } from './entities/club.entity';
import { User } from '../user/entities/user.entity';
import { EnumUserType } from '../../types/user';

describe('ClubService', () => {
  let service: ClubService;
  let clubRepository: {
    create: jest.Mock;
    save: jest.Mock;
    findOne: jest.Mock;
    find: jest.Mock;
    preload: jest.Mock;
    remove: jest.Mock;
  };
  let userRepository: { findOne: jest.Mock };

  beforeEach(async () => {
    clubRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      preload: jest.fn(),
      remove: jest.fn(),
    };

    userRepository = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubService,
        { provide: getRepositoryToken(Club), useValue: clubRepository },
        { provide: getRepositoryToken(User), useValue: userRepository },
      ],
    }).compile();

    service = module.get<ClubService>(ClubService);
  });

  it('throws 404 when owner user is not found', async () => {
    userRepository.findOne.mockResolvedValue(null);

    await expect(
      service.create({ name: 'Leões', ownerUserId: 10 } as any),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('throws 409 when user already has a club profile', async () => {
    userRepository.findOne.mockResolvedValue({
      id: 5,
      type: EnumUserType.CLUBE,
    });
    clubRepository.findOne.mockResolvedValue({ id: 99, ownerUserId: 5 });

    await expect(
      service.create({ name: 'Leões', ownerUserId: 5 } as any),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('creates club when owner is a clube user without profile', async () => {
    const owner = { id: 7, type: EnumUserType.CLUBE };
    const created = { id: 1, name: 'Águias', ownerUserId: 7 };

    userRepository.findOne.mockResolvedValue(owner);
    clubRepository.findOne.mockResolvedValue(null);
    clubRepository.create.mockReturnValue(created);
    clubRepository.save.mockResolvedValue(created);

    const result = await service.create({
      name: 'Águias',
      ownerUserId: 7,
    } as any);

    expect(clubRepository.create).toHaveBeenCalled();
    expect(clubRepository.save).toHaveBeenCalledWith(created);
    expect(result).toEqual(created);
  });
});
