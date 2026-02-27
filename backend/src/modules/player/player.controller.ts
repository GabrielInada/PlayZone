import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayerResponseDto } from './dto/player-response.dto';

@ApiTags('Player')
@Controller('player')
export class PlayerController {
  constructor(private readonly playersService: PlayerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new player' })
  @ApiBody({ type: CreatePlayerDto })
  @ApiResponse({ status: 201, description: 'Player created successfully', type: PlayerResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.create(createPlayerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all players' })
  @ApiResponse({ status: 200, description: 'List of all players', type: [PlayerResponseDto] })
  @ApiOkResponse({
    description: 'Example list of players',
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
  @ApiResponse({ status: 404, description: 'No players found' })
  findAll() {
    return this.playersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a player by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Player ID' })
  @ApiResponse({ status: 200, description: 'Player found', type: PlayerResponseDto })
  @ApiOkResponse({
    description: 'Example player response',
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
  @ApiResponse({ status: 404, description: 'Player not found' })
  findOne(@Param('id') id: string) {
    return this.playersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a player by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Player ID' })
  @ApiBody({ type: UpdatePlayerDto })
  @ApiResponse({ status: 200, description: 'Player updated successfully', type: PlayerResponseDto })
  @ApiResponse({ status: 404, description: 'Player not found' })
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playersService.update(+id, updatePlayerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a player by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Player ID' })
  @ApiResponse({ status: 200, description: 'Player deleted successfully', type: PlayerResponseDto })
  @ApiResponse({ status: 404, description: 'Player not found' })
  remove(@Param('id') id: string) {
    return this.playersService.remove(+id);
  }
}
