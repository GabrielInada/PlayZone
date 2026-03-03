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
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

const createMatchExample = {
  date: '2026-03-10T19:00:00.000Z',
  locationId: 1,
  homeTeamId: 1,
  awayTeamId: 2,
  delegateId: 7,
  status: 'scheduled',
};

const updateMatchExample = {
  date: '2026-03-10T20:00:00.000Z',
  locationId: 2,
  delegateId: 8,
  status: 'finished',
};

const matchResponseExample = {
  id: 1,
  date: '2026-03-10T19:00:00.000Z',
  locationId: 1,
  status: 'scheduled',
  delegateId: 7,
  homeTeam: { id: 1, name: 'Time Demo 1' },
  awayTeam: { id: 2, name: 'Time Demo 2' },
  location: { id: 1, name: 'Arena Norte' },
  delegate: { id: 7, name: 'Delegado Demo' },
  report: null,
};

const badRequestValidationExample = {
  statusCode: 400,
  message: ['homeTeamId must not be less than 1'],
  error: 'Bad Request',
};

const badRequestBusinessRuleExample = {
  statusCode: 400,
  message: 'Time mandante e visitante devem ser diferentes',
  error: 'Bad Request',
};

const notFoundExample = {
  statusCode: 404,
  message: 'Partida com ID 99 não encontrada',
  error: 'Not Found',
};

@ApiTags('Partida')
@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma partida' })
  @ApiBody({
    type: CreateMatchDto,
    examples: {
      createMatch: {
        summary: 'Exemplo de criação de partida',
        value: createMatchExample,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Partida criada com sucesso.',
    schema: { example: matchResponseExample },
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos para criação ou regra de negócio inválida.',
    schema: { example: badRequestValidationExample },
  })
  @ApiNotFoundResponse({
    description: 'Time, delegado ou local não encontrado.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Time mandante e/ou visitante não encontrado',
        error: 'Not Found',
      },
    },
  })
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.create(createMatchDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as partidas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de partidas retornada com sucesso.',
    schema: { example: [matchResponseExample] },
  })
  findAll() {
    return this.matchService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma partida por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Partida encontrada.',
    schema: { example: matchResponseExample },
  })
  @ApiBadRequestResponse({
    description: 'ID inválido.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Partida não encontrada.',
    schema: { example: notFoundExample },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.matchService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma partida por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({
    type: UpdateMatchDto,
    examples: {
      updateMatch: {
        summary: 'Exemplo de atualização de partida',
        value: updateMatchExample,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Partida atualizada com sucesso.',
    schema: {
      example: {
        ...matchResponseExample,
        ...updateMatchExample,
        locationId: 2,
        delegateId: 8,
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'ID inválido ou dados inválidos para atualização (ex.: mandante e visitante iguais).',
    schema: { example: badRequestBusinessRuleExample },
  })
  @ApiNotFoundResponse({
    description: 'Partida, time, delegado ou local não encontrado.',
    schema: { example: notFoundExample },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMatchDto: UpdateMatchDto,
  ) {
    return this.matchService.update(id, updateMatchDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma partida por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Partida removida com sucesso.',
    schema: { example: matchResponseExample },
  })
  @ApiBadRequestResponse({
    description: 'ID inválido.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Partida não encontrada.',
    schema: { example: notFoundExample },
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.matchService.remove(id);
  }
}
