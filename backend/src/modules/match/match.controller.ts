import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

@ApiTags('Match')
@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma partida' })
  @ApiBody({ type: CreateMatchDto })
  @ApiResponse({ status: 201, description: 'Partida criada com sucesso.' })
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.create(createMatchDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as partidas' })
  @ApiResponse({ status: 200, description: 'Lista de partidas retornada com sucesso.' })
  findAll() {
    return this.matchService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma partida por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 200, description: 'Partida encontrada.' })
  @ApiResponse({ status: 404, description: 'Partida não encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.matchService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma partida por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateMatchDto })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 200, description: 'Partida atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Partida não encontrada.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchService.update(id, updateMatchDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma partida por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 200, description: 'Partida removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Partida não encontrada.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.matchService.remove(id);
  }
}
