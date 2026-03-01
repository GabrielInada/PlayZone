import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um local' })
  @ApiBody({ type: CreateLocationDto })
  @ApiResponse({ status: 201, description: 'Local criado com sucesso.' })
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os locais' })
  @ApiResponse({ status: 200, description: 'Lista de locais retornada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Nenhum local encontrado.' })
  findAll() {
    return this.locationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um local por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 200, description: 'Local encontrado.' })
  @ApiResponse({ status: 404, description: 'Local não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um local por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateLocationDto })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 200, description: 'Local atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Local não encontrado.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.update(id, updateLocationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um local por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 200, description: 'Local removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Local não encontrado.' })
  @ApiResponse({ status: 409, description: 'Não é possível remover local com partidas vinculadas.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.remove(id);
  }
}
