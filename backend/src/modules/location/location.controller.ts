import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

const locationCreateExample = {
  name: 'Ginásio da UFRA',
  address: 'Av. Perimetral, 2501',
  city: 'Belém',
  state: 'PA',
  capacity: 1200,
  imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
};

const locationUpdateExample = {
  capacity: 1500,
  imageUrl: 'https://cdn.example.com/locations/ginasio-ufra.jpg',
};

const locationImageTooLargeErrorExample = {
  statusCode: 400,
  message: 'imageUrl deve ter no máximo 200000 caracteres',
  error: 'Bad Request',
};

const locationCreateSuccessExample = {
  id: 1,
  name: 'Ginásio da UFRA',
  address: 'Av. Perimetral, 2501',
  city: 'Belém',
  state: 'PA',
  capacity: 1200,
  imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
  createdAt: '2026-03-02T15:00:00.000Z',
  updatedAt: '2026-03-02T15:00:00.000Z',
};

const locationUpdateSuccessExample = {
  id: 1,
  name: 'Ginásio da UFRA',
  address: 'Av. Perimetral, 2501',
  city: 'Belém',
  state: 'PA',
  capacity: 1500,
  imageUrl: 'https://cdn.example.com/locations/ginasio-ufra.jpg',
  createdAt: '2026-03-02T15:00:00.000Z',
  updatedAt: '2026-03-02T15:05:00.000Z',
};

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um local' })
  @ApiBody({
    type: CreateLocationDto,
    examples: {
      withDataUriImage: {
        summary: 'Exemplo com imageUrl em data URI',
        value: locationCreateExample,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou imageUrl acima do limite configurado.' })
  @ApiBadRequestResponse({
    description: 'Erro de validação (ex.: imageUrl acima do limite).',
    schema: { example: locationImageTooLargeErrorExample },
  })
  @ApiResponse({
    status: 201,
    description: 'Local criado com sucesso.',
    schema: { example: locationCreateSuccessExample },
  })
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
  @ApiBody({
    type: UpdateLocationDto,
    examples: {
      updateImageUrl: {
        summary: 'Atualização apenas da imagem',
        value: locationUpdateExample,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'ID inválido ou imageUrl acima do limite configurado.' })
  @ApiBadRequestResponse({
    description: 'Erro de validação (ex.: imageUrl acima do limite).',
    schema: { example: locationImageTooLargeErrorExample },
  })
  @ApiResponse({
    status: 200,
    description: 'Local atualizado com sucesso.',
    schema: { example: locationUpdateSuccessExample },
  })
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
