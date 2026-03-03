import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TournamentService } from './tournament.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

const tournamentCreateExample = {
  name: 'Copa PlayZone 2026',
};

const tournamentUpdateExample = {
  name: 'Copa PlayZone 2026 - Série Ouro',
};

const tournamentResponseExample = {
  id: 1,
  name: 'Copa PlayZone 2026',
  createdAt: '2026-03-03T17:30:00.000Z',
  updatedAt: '2026-03-03T17:30:00.000Z',
};

const tournamentDeleteResponseExample = {
  message: 'Campeonato removido com sucesso',
};

const badRequestExample = {
  statusCode: 400,
  message: ['name should not be empty'],
  error: 'Bad Request',
};

const conflictExample = {
  statusCode: 409,
  message: 'Já existe campeonato com este nome',
  error: 'Conflict',
};

const notFoundExample = {
  statusCode: 404,
  message: 'Campeonato não encontrado',
  error: 'Not Found',
};

@ApiTags('Campeonato')
@Controller('tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um campeonato' })
  @ApiBody({
    type: CreateTournamentDto,
    examples: {
      createTournament: {
        summary: 'Exemplo de criação de campeonato',
        value: tournamentCreateExample,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Campeonato criado com sucesso.',
    schema: { example: tournamentResponseExample },
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos.',
    schema: { example: badRequestExample },
  })
  @ApiConflictResponse({
    description: 'Já existe campeonato com este nome.',
    schema: { example: conflictExample },
  })
  create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentService.create(createTournamentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista campeonatos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de campeonatos retornada com sucesso.',
    schema: { example: [tournamentResponseExample] },
  })
  findAll() {
    return this.tournamentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca campeonato por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Campeonato encontrado.',
    schema: { example: tournamentResponseExample },
  })
  @ApiBadRequestResponse({
    description: 'ID inválido.',
    schema: {
      example: { statusCode: 400, message: 'Validation failed (numeric string is expected)', error: 'Bad Request' },
    },
  })
  @ApiNotFoundResponse({
    description: 'Campeonato não encontrado.',
    schema: { example: notFoundExample },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza campeonato por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({
    type: UpdateTournamentDto,
    examples: {
      updateTournament: {
        summary: 'Exemplo de atualização de campeonato',
        value: tournamentUpdateExample,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Campeonato atualizado com sucesso.',
    schema: { example: { ...tournamentResponseExample, ...tournamentUpdateExample } },
  })
  @ApiBadRequestResponse({
    description: 'ID inválido ou dados inválidos.',
    schema: { example: badRequestExample },
  })
  @ApiNotFoundResponse({
    description: 'Campeonato não encontrado.',
    schema: { example: notFoundExample },
  })
  @ApiConflictResponse({
    description: 'Já existe campeonato com este nome.',
    schema: { example: conflictExample },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ) {
    return this.tournamentService.update(id, updateTournamentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove campeonato por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Campeonato removido com sucesso.',
    schema: { example: tournamentDeleteResponseExample },
  })
  @ApiBadRequestResponse({
    description: 'ID inválido.',
    schema: {
      example: { statusCode: 400, message: 'Validation failed (numeric string is expected)', error: 'Bad Request' },
    },
  })
  @ApiNotFoundResponse({
    description: 'Campeonato não encontrado.',
    schema: { example: notFoundExample },
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentService.remove(id);
  }
}
