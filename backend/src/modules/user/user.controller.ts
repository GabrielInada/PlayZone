import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiQuery, ApiOkResponse } from '@nestjs/swagger';
import { Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserResponseDto } from './dto/user-response.dto';
import { FindAllUsersResponseDto } from './dto/find-all-users-response.dto';
import { DeleteUserResponseDto } from './dto/delete-user-response.dto';


@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um usuário' })
  @ApiBody({ type: CreateUserRequestDto })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.', type: UserResponseDto })
  create(@Body() userPayload: CreateUserRequestDto) {
    return this.userService.create(userPayload);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os usuários' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso.',
    type: FindAllUsersResponseDto,
  })
  @ApiOkResponse({
    description: 'Exemplo de resposta paginada de usuários.',
    schema: {
      example: {
        data: [
          {
            id: 1,
            name: 'Gabriel Inada',
            email: 'gabrielinada@email.com',
            type: 'delegado',
            role: 'user',
            createdAt: '2026-02-27T12:00:00.000Z',
            updatedAt: '2026-02-27T12:00:00.000Z',
          },
        ],
        meta: {
          total: 1,
          page: 1,
          lastPage: 1,
          size: 10,
        },
      },
    },
  })
  findAll(@Query('page') page?: number, @Query('size') size?: number) {
    const pageNumber = page && page > 0 ? Number(page) : 1;
    const sizeNumber = size && size > 0 ? Number(size) : 10;
    return this.userService.findAll(pageNumber, sizeNumber);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retorna os dados do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário retornados com sucesso.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  getMe(@Req() req) {
    return this.userService.getUserProfile(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um usuário pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Get(':id/details')
  @ApiOperation({ summary: 'Retorna detalhes do usuário' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do usuário retornados com sucesso.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  getUserDetails(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserDetails(id);
  }


  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um usuário pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um usuário pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso.', type: DeleteUserResponseDto })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
