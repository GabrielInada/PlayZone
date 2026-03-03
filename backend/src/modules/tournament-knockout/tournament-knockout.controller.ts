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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TournamentKnockoutService } from './tournament-knockout.service';
import { CreateTournamentKnockoutDto } from './dto/create-tournament-knockout.dto';
import { UpdateTournamentKnockoutDto } from './dto/update-tournament-knockout.dto';

@ApiTags('Mata-mata do Campeonato')
@Controller('tournament-knockout')
export class TournamentKnockoutController {
  constructor(
    private readonly tournamentKnockoutService: TournamentKnockoutService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar confronto do mata-mata de um campeonato' })
  @ApiBody({
    type: CreateTournamentKnockoutDto,
    examples: {
      quarterFinalManualWinner: {
        summary: 'Quartas de final com vencedor definido manualmente',
        value: {
          tournamentId: 1,
          stage: 'QUARTER_FINAL',
          roundOrder: 1,
          slot: 1,
          matchId: 42,
          winnerTeamId: 7,
          notes: 'W.O. visitante',
        },
      },
      semifinalInferWinner: {
        summary: 'Semifinal sem winnerTeamId (inferido de súmula validada)',
        value: {
          tournamentId: 1,
          stage: 'SEMI_FINAL',
          roundOrder: 2,
          matchId: 57,
          notes: 'Aguardando revisão final da arbitragem',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  @ApiResponse({ status: 404, description: 'Partida não encontrada.' })
  @ApiResponse({
    status: 409,
    description: 'Conflito em matchId ou combinação de campeonato/fase/slot quando informado.',
  })
  @ApiResponse({ status: 201, description: 'Confronto de mata-mata criado com sucesso.' })
  create(@Body() createTournamentKnockoutDto: CreateTournamentKnockoutDto) {
    return this.tournamentKnockoutService.create(createTournamentKnockoutDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar confrontos de mata-mata do campeonato' })
  @ApiResponse({
    status: 200,
    description: 'Lista de confrontos retornada com sucesso.',
    example: [
      {
        id: 1,
        tournamentId: 1,
        stage: 'QUARTER_FINAL',
        roundOrder: 1,
        slot: 1,
        matchId: 42,
        winnerTeamId: 7,
        isDecided: true,
        notes: 'W.O. visitante',
        createdAt: '2026-03-02T18:30:00.000Z',
        updatedAt: '2026-03-02T18:30:00.000Z',
        match: {
          id: 42,
          status: 'finished',
          homeTeam: { id: 7, name: 'Time Azul' },
          awayTeam: { id: 9, name: 'Time Branco' },
          report: {
            id: 15,
            status: 'validated',
            homeScore: 2,
            awayScore: 1,
          },
        },
        winnerTeam: { id: 7, name: 'Time Azul' },
      },
    ],
  })
  findAll() {
    return this.tournamentKnockoutService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar confronto de mata-mata por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({
    status: 200,
    description: 'Confronto de mata-mata encontrado.',
    example: {
      id: 1,
          tournamentId: 1,
      stage: 'SEMI_FINAL',
      roundOrder: 2,
      slot: 1,
      matchId: 57,
      winnerTeamId: 7,
      isDecided: true,
      notes: 'Vencedor confirmado após revisão administrativa',
      createdAt: '2026-03-05T20:10:00.000Z',
      updatedAt: '2026-03-05T20:45:00.000Z',
      match: {
        id: 57,
        status: 'finished',
        homeTeam: { id: 7, name: 'Time Azul' },
        awayTeam: { id: 3, name: 'Time Preto' },
        report: {
          id: 21,
          status: 'validated',
          homeScore: 1,
          awayScore: 0,
        },
      },
      winnerTeam: { id: 7, name: 'Time Azul' },
    },
  })
  @ApiResponse({ status: 404, description: 'Confronto de mata-mata não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentKnockoutService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar confronto de mata-mata por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({
    type: UpdateTournamentKnockoutDto,
    examples: {
      setWinnerAfterReview: {
        summary: 'Definir vencedor após validação da súmula',
        value: {
          winnerTeamId: 7,
          notes: 'Vencedor confirmado após revisão administrativa',
        },
      },
      moveBracketSlot: {
        summary: 'Ajustar fase/slot manualmente',
        value: {
          stage: 'FINAL',
          roundOrder: 3,
          slot: 1,
          matchId: 63,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'ID inválido ou dados inválidos (ex.: winnerTeamId não pertence à partida).',
  })
  @ApiResponse({ status: 404, description: 'Confronto de mata-mata ou partida não encontrada.' })
  @ApiResponse({
    status: 409,
    description: 'Conflito em matchId ou combinação de campeonato/fase/slot quando informado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Confronto de mata-mata atualizado com sucesso.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTournamentKnockoutDto: UpdateTournamentKnockoutDto,
  ) {
    return this.tournamentKnockoutService.update(
      id,
      updateTournamentKnockoutDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover confronto de mata-mata por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 200, description: 'Confronto de mata-mata removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Confronto de mata-mata não encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentKnockoutService.remove(id);
  }
}
