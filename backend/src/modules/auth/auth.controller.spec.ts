import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    validateUser: jest.Mock;
    login: jest.Mock;
    signup: jest.Mock;
  };
  let userService: {
    findByEmail: jest.Mock;
  };

  beforeEach(async () => {
    authService = {
      validateUser: jest.fn(),
      login: jest.fn(),
      signup: jest.fn(),
    };

    userService = {
      findByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: UserService, useValue: userService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('throws unauthorized on invalid credentials', async () => {
    authService.validateUser.mockResolvedValue(null);

    await expect(
      controller.login({ email: 'a@a.com', password: 'bad' }),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('delegates signup to auth service', async () => {
    const dto: any = { name: 'User', email: 'u@u.com', password: '123456' };
    const expected = { id: 1, email: 'u@u.com' };
    authService.signup.mockResolvedValue(expected);

    const result = await controller.signup(dto);

    expect(authService.signup).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('delegates profile lookup by email', async () => {
    userService.findByEmail.mockResolvedValue({ id: 9, email: 'me@me.com' });

    const result = await controller.getProfile({ user: { email: 'me@me.com' } } as any);

    expect(userService.findByEmail).toHaveBeenCalledWith('me@me.com');
    expect(result).toEqual({ id: 9, email: 'me@me.com' });
  });
});
