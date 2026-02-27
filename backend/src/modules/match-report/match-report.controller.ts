import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { MatchReportService } from './match-report.service';
import { CreateMatchReportDto } from './dto/create-match-report.dto';
import { UpdateMatchReportDto } from './dto/update-match-report.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { ReviewMatchReportDto } from '../match-reports/dto/review-match-report.dto';

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
  create(@Body() createMatchReportDto: CreateMatchReportDto, @Req() req: any) {
    const user = req.user;
    return this.matchReportService.create(user.id, createMatchReportDto);
  }

  @Get()
  findAll() {
    return this.matchReportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchReportService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatchReportDto: UpdateMatchReportDto) {
    return this.matchReportService.update(+id, updateMatchReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchReportService.remove(+id);
  }

  // ------------------------------------------
  // ROTA DELEGADO: Ver minhas partidas
  // GET /match-reports/my-matches/1  <-- Passando ID do delegado na URL para facilitar teste
  // ------------------------------------------
  @Get('my-matches/:delegateId')
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
  review(@Param('id') id: string, @Body() dto: ReviewMatchReportDto) {
    return this.matchReportService.review(+id, dto);
  }
}
