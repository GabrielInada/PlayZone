import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayerResponseDto } from './dto/player-response.dto';

@ApiTags('Jogador')
@Controller('player')
export class PlayerController {
  constructor(private readonly playersService: PlayerService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo jogador' })
  @ApiBody({ type: CreatePlayerDto })
  @ApiResponse({
    status: 201,
    description: 'Jogador criado com sucesso',
    type: PlayerResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Requisição inválida - erro de validação' })
  @ApiResponse({ status: 404, description: 'Time não encontrado' })
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.create(createPlayerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os jogadores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos os jogadores',
    type: [PlayerResponseDto],
  })
  @ApiOkResponse({
    description: 'Exemplo de lista de jogadores',
    schema: {
      example: [
        {
          id: 1,
          name: 'João Silva',
          shirtNumber: 10,
          position: 'goleiro',
          teamId: 1,
          createdAt: '2026-02-27T12:00:00.000Z',
          updatedAt: '2026-02-27T12:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 404, description: 'Nenhum jogador encontrado' })
  findAll() {
    return this.playersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um jogador por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do jogador' })
  @ApiResponse({ status: 400, description: 'ID de jogador inválido' })
  @ApiResponse({
    status: 200,
    description: 'Jogador encontrado',
    type: PlayerResponseDto,
  })
  @ApiOkResponse({
    description: 'Exemplo de resposta de jogador',
    schema: {
      example: {
        id: 1,
        name: 'João Silva',
        shirtNumber: 10,
        position: 'goleiro',
        teamId: 1,
        createdAt: '2026-02-27T12:00:00.000Z',
        updatedAt: '2026-02-27T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Jogador não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um jogador por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do jogador' })
  @ApiBody({ type: UpdatePlayerDto })
  @ApiResponse({ status: 400, description: 'ID de jogador inválido' })
  @ApiResponse({
    status: 200,
    description: 'Jogador atualizado com sucesso',
    type: PlayerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Jogador ou time não encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    return this.playersService.update(id, updatePlayerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um jogador por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do jogador' })
  @ApiResponse({ status: 400, description: 'ID de jogador inválido' })
  @ApiResponse({
    status: 200,
    description: 'Jogador removido com sucesso',
    type: PlayerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Jogador não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.remove(id);
  }
}
