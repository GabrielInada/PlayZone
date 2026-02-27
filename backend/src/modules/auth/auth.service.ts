import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { EnumUserRole } from '../../types/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const foundUser = await this.userService.findByEmail(email.toLowerCase());

    if (!foundUser)
      throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);

    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (isMatch) {
      return foundUser;
    }

    return null;
  }

  login(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, updatedAt, password, ...userPayload } = user;
    return {
      access_token: this.jwtService.sign(userPayload),
    };
  }

  async signup(userPayload: SignupDto) {
    const hash = await bcrypt.hash(userPayload.password, 10);
    return this.userService.create({
      ...userPayload,
      password: hash,
      role: EnumUserRole.USER, // Por padrão no cadastro só pode ser criado usuários com a role "user"
    });
  }
}