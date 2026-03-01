import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userService: { findByEmail: jest.Mock; createWithRole: jest.Mock };
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    userService = {
      findByEmail: jest.fn(),
      createWithRole: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('throws unauthorized when user is not found', async () => {
    userService.findByEmail.mockResolvedValue(null);

    await expect(service.validateUser('not@found.com', '123')).rejects.toBeInstanceOf(HttpException);
  });

  it('returns token payload on login', () => {
    jwtService.sign.mockReturnValue('jwt-token');

    const result = service.login({
      id: 1,
      name: 'User',
      email: 'user@email.com',
      password: 'secret',
      type: 'delegado',
      role: 'user',
    } as any);

    expect(jwtService.sign).toHaveBeenCalled();
    expect(result).toEqual({ access_token: 'jwt-token' });
  });
});
