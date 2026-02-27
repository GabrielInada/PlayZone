import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StandingsService } from './standings.service';
import { CreateStandingDto } from './dto/create-standing.dto';
import { UpdateStandingDto } from './dto/update-standing.dto';

@ApiTags('Standings')
@Controller('standings')
export class StandingsController {
  constructor(private readonly standingsService: StandingsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um registro de classificação' })
  @ApiBody({ type: CreateStandingDto })
  @ApiResponse({ status: 201, description: 'Classificação criada com sucesso.' })
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
  @ApiResponse({ status: 200, description: 'Classificação encontrada.' })
  @ApiResponse({ status: 404, description: 'Classificação não encontrada.' })
  findOne(@Param('id') id: string) {
    return this.standingsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza classificação por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateStandingDto })
  @ApiResponse({ status: 200, description: 'Classificação atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Classificação não encontrada.' })
  update(@Param('id') id: string, @Body() updateStandingDto: UpdateStandingDto) {
    return this.standingsService.update(+id, updateStandingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove classificação por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Classificação removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Classificação não encontrada.' })
  remove(@Param('id') id: string) {
    return this.standingsService.remove(+id);
  }
}
