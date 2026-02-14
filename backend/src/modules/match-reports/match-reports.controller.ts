import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch, 
  // UseGuards, 
  // Request 
} from '@nestjs/common';
import { MatchReportsService } from './match-reports.service';
import { CreateMatchReportDto } from './dto/create-match-report.dto';
import { ReviewMatchReportDto } from './dto/review-match-report.dto';

@Controller('match-reports')
export class MatchReportsController {
  constructor(private readonly service: MatchReportsService) {}

  // ------------------------------------------
  // ROTA DELEGADO: Ver minhas partidas
  // GET /match-reports/my-matches/1  <-- Passando ID do delegado na URL para facilitar teste
  // ------------------------------------------
  @Get('my-matches/:delegateId')
  getMyMatches(@Param('delegateId') delegateId: string) {
    // Em produção, pegariamos o ID do token JWT: req.user.id
    return this.service.getAssignedMatches(+delegateId);
  }

  // ------------------------------------------
  // ROTA DELEGADO: Enviar Súmula
  // POST /match-reports
  // Body: { matchId, homeScore, awayScore, goals, cards }
  // ------------------------------------------
  @Post()
  create(@Body() dto: CreateMatchReportDto) {
    // IMPORTANTE: Aqui estou simulando que o Delegado ID 1 está logado.
    // Quando você implementar autenticação JWT, troque 1 por req.user.id
    const fakeLoggedDelegateId = 1; 
    return this.service.create(fakeLoggedDelegateId, dto);
  }

  // ------------------------------------------
  // ROTA ADMIN: Validar/Rejeitar Súmula
  // PATCH /match-reports/10/review
  // Body: { action: "ACCEPT" } ou { action: "REJECT", reason: "Erro no placar" }
  // ------------------------------------------
  @Patch(':id/review')
  review(@Param('id') id: string, @Body() dto: ReviewMatchReportDto) {
    return this.service.review(+id, dto);
  }
}