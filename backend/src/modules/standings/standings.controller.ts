import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StandingsService } from './standings.service';
import { CreateStandingDto } from './dto/create-standing.dto';
import { UpdateStandingDto } from './dto/update-standing.dto';

@ApiTags('Standings')
@Controller('standings')
export class StandingsController {
  constructor(private readonly standingsService: StandingsService) {}

  @Post()
  @ApiOperation({ summary: 'Operação não suportada para classificação' })
  @ApiBody({ type: CreateStandingDto })
  @ApiResponse({ status: 400, description: 'Operação não suportada.' })
  create(@Body() createStandingDto: CreateStandingDto) {
    return this.standingsService.create(createStandingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista classificações' })
  @ApiResponse({ status: 200, description: 'Lista de classificações retornada com sucesso.' })
  findAll() {
    return this.standingsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca classificação por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 200, description: 'Classificação encontrada.' })
  @ApiResponse({ status: 404, description: 'Classificação não encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.standingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Operação não suportada para classificação' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateStandingDto })
  @ApiResponse({ status: 400, description: 'Operação não suportada.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateStandingDto: UpdateStandingDto) {
    return this.standingsService.update(id, updateStandingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Operação não suportada para classificação' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 400, description: 'Operação não suportada.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.standingsService.remove(id);
  }
}
