import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MatchReportService } from './match-report.service';
import { CreateMatchReportDto } from './dto/create-match-report.dto';
import { UpdateMatchReportDto } from './dto/update-match-report.dto';
import { UserService } from '../user/user.service';
import { ReviewMatchReportDto } from '../match-reports/dto/review-match-report.dto';

@ApiTags('Match Report')
@Controller('match-report')
export class MatchReportController {
  constructor(
    private readonly matchReportService: MatchReportService,
    private readonly userService: UserService
  ) {}

  // ------------------------------------------
    // ROTA DELEGADO: Enviar Súmula
    // POST /match-reports
    // Body: { matchId, homeScore, awayScore, goals, cards }
    // ------------------------------------------
  @Post()
  @ApiOperation({ summary: 'Cria uma súmula de partida' })
  @ApiBody({ type: CreateMatchReportDto })
  @ApiResponse({ status: 201, description: 'Súmula criada com sucesso.' })
  create(@Body() createMatchReportDto: CreateMatchReportDto, @Req() req: any) {
    const user = req.user;
    return this.matchReportService.create(user.id, createMatchReportDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as súmulas' })
  @ApiResponse({ status: 200, description: 'Lista de súmulas retornada com sucesso.' })
  findAll() {
    return this.matchReportService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma súmula por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Súmula encontrada.' })
  @ApiResponse({ status: 404, description: 'Súmula não encontrada.' })
  findOne(@Param('id') id: string) {
    return this.matchReportService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma súmula por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateMatchReportDto })
  @ApiResponse({ status: 200, description: 'Súmula atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Súmula não encontrada.' })
  update(@Param('id') id: string, @Body() updateMatchReportDto: UpdateMatchReportDto) {
    return this.matchReportService.update(+id, updateMatchReportDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma súmula por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Súmula removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Súmula não encontrada.' })
  remove(@Param('id') id: string) {
    return this.matchReportService.remove(+id);
  }

  // ------------------------------------------
  // ROTA DELEGADO: Ver minhas partidas
  // GET /match-reports/my-matches/1  <-- Passando ID do delegado na URL para facilitar teste
  // ------------------------------------------
  @Get('my-matches/:delegateId')
  @ApiOperation({ summary: 'Lista partidas atribuídas ao delegado' })
  @ApiParam({ name: 'delegateId', type: Number })
  @ApiResponse({ status: 200, description: 'Partidas atribuídas retornadas com sucesso.' })
  getMyMatches(@Param('delegateId') delegateId: string) {
    // Em produção, pegariamos o ID do token JWT: req.user.id
    return this.matchReportService.getAssignedMatches(+delegateId);
  }

  // ------------------------------------------
  // ROTA ADMIN: Validar/Rejeitar Súmula
  // PATCH /match-reports/10/review
  // Body: { action: "ACCEPT" } ou { action: "REJECT", reason: "Erro no placar" }
  // ------------------------------------------
  @Patch(':id/review')
  @ApiOperation({ summary: 'Revisa uma súmula (aceita ou rejeita)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: ReviewMatchReportDto })
  @ApiResponse({ status: 200, description: 'Súmula revisada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Súmula não encontrada.' })
  review(@Param('id') id: string, @Body() dto: ReviewMatchReportDto) {
    return this.matchReportService.review(+id, dto);
  }
}
