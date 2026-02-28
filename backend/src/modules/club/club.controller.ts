import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@ApiTags('Club')
@Controller('club')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um clube' })
  @ApiBody({ type: CreateClubDto })
  @ApiResponse({ status: 201, description: 'Clube criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Usuário dono inválido para perfil de clube.' })
  @ApiResponse({ status: 404, description: 'Usuário dono não encontrado.' })
  @ApiResponse({ status: 409, description: 'Usuário já possui perfil de clube.' })
  create(@Body() createClubDto: CreateClubDto) {
    return this.clubService.create(createClubDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os clubes' })
  @ApiResponse({ status: 200, description: 'Lista de clubes retornada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Nenhum clube encontrado.' })
  findAll() {
    return this.clubService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Busca perfil de clube por ID do usuário dono' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 200, description: 'Perfil de clube encontrado.' })
  @ApiResponse({ status: 404, description: 'Perfil de clube não encontrado para o usuário.' })
  findByOwnerUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.clubService.findByOwnerUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um clube por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 200, description: 'Clube encontrado.' })
  @ApiResponse({ status: 404, description: 'Clube não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clubService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um clube por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateClubDto })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 200, description: 'Clube atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Clube não encontrado.' })
  @ApiResponse({ status: 409, description: 'Usuário já possui perfil de clube.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateClubDto: UpdateClubDto) {
    return this.clubService.update(id, updateClubDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um clube por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 200, description: 'Clube removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Clube não encontrado.' })
  @ApiResponse({ status: 409, description: 'Não é possível remover clube com times vinculados.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clubService.remove(id);
  }
}
