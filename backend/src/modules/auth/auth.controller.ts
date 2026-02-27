import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBody, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UserService } from '../user/user.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from '../user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user)
      throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);

    return this.authService.login(user);
  }

  @Serialize(UserDto)
  @Post('signup')
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: 200,
    description: 'Usuário criado com sucesso.',
  })
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Serialize(UserDto)
  @Get('profile')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Usuário autenticado retornado com sucesso.',
  })
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return this.userService.findByEmail(req.user.email);
  }
}