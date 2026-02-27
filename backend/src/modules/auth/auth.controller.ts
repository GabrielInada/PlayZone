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
import {
  ApiBody,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UserService } from '../user/user.service';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { UserResponseDto } from '../user/dto/user-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Autentica usuário e retorna token JWT' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user)
      throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);

    return this.authService.login(user);
  }

  @Serialize(UserResponseDto)
  @Post('signup')
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: 200,
    description: 'Usuário criado com sucesso.',
    type: UserResponseDto,
  })
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Serialize(UserResponseDto)
  @Get('profile')
  @ApiOperation({ summary: 'Retorna perfil do usuário autenticado' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Usuário autenticado retornado com sucesso.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return this.userService.findByEmail(req.user.email);
  }
}