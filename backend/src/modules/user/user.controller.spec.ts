import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: {
    create: jest.Mock;
    findAll: jest.Mock;
    getUserProfile: jest.Mock;
    findOne: jest.Mock;
    getUserDetails: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    userService = {
      create: jest.fn(),
      findAll: jest.fn(),
      getUserProfile: jest.fn(),
      findOne: jest.fn(),
      getUserDetails: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userService }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('uses default pagination when page and size are not provided', async () => {
    userService.findAll.mockResolvedValue({
      data: [],
      meta: { page: 1, size: 10 },
    });

    await controller.findAll(undefined, undefined);

    expect(userService.findAll).toHaveBeenCalledWith(1, 10);
  });

  it('delegates findOne with id', async () => {
    userService.findOne.mockResolvedValue({ id: 6, name: 'Gabriel' });

    const result = await controller.findOne(6);

    expect(userService.findOne).toHaveBeenCalledWith(6);
    expect(result).toEqual({ id: 6, name: 'Gabriel' });
  });

  it('delegates getMe using req.user.userId', async () => {
    userService.getUserProfile.mockResolvedValue({
      id: 20,
      email: 'me@me.com',
    });

    const result = await controller.getMe({ user: { userId: 20 } } as any);

    expect(userService.getUserProfile).toHaveBeenCalledWith(20);
    expect(result).toEqual({ id: 20, email: 'me@me.com' });
  });
});
