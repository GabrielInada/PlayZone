import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let userRepository: {
    create: jest.Mock;
    save: jest.Mock;
    findAndCount: jest.Mock;
    findOne: jest.Mock;
    preload: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    userRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      preload: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: userRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('returns paginated users with mapped fields', async () => {
    userRepository.findAndCount.mockResolvedValue([
      [
        {
          id: 1,
          name: 'Gabriel',
          email: 'g@email.com',
          type: 'delegado',
          role: 'user',
          createdAt: new Date('2026-03-01T00:00:00.000Z'),
          updatedAt: new Date('2026-03-01T00:00:00.000Z'),
        },
      ],
      1,
    ]);

    const result = await service.findAll(1, 10);

    expect(result.meta.total).toBe(1);
    expect(result.data[0].email).toBe('g@email.com');
  });

  it('throws 404 when remove affects no rows', async () => {
    userRepository.delete.mockResolvedValue({ affected: 0 });

    await expect(service.remove(999)).rejects.toBeInstanceOf(HttpException);
  });
});
