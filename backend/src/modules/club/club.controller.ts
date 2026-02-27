import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
  create(@Body() createClubDto: CreateClubDto) {
    return this.clubService.create(createClubDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os clubes' })
  @ApiResponse({ status: 200, description: 'Lista de clubes retornada com sucesso.' })
  findAll() {
    return this.clubService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um clube por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Clube encontrado.' })
  @ApiResponse({ status: 404, description: 'Clube não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.clubService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um clube por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateClubDto })
  @ApiResponse({ status: 200, description: 'Clube atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Clube não encontrado.' })
  update(@Param('id') id: string, @Body() updateClubDto: UpdateClubDto) {
    return this.clubService.update(+id, updateClubDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um clube por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Clube removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Clube não encontrado.' })
  remove(@Param('id') id: string) {
    return this.clubService.remove(+id);
  }
}
