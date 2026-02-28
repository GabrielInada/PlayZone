import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException, ParseIntPipe } from '@nestjs/common';
import { Request } from 'express';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MatchReportService } from './match-report.service';
import { CreateMatchReportDto } from './dto/create-match-report.dto';
import { UpdateMatchReportDto } from './dto/update-match-report.dto';
import { ReviewMatchReportDto } from './dto/review-match-report.dto';

@ApiTags('Match Report')
@Controller('match-report')
export class MatchReportController {
  constructor(private readonly matchReportService: MatchReportService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma súmula de partida' })
  @ApiBody({ type: CreateMatchReportDto })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado.' })
  @ApiResponse({ status: 201, description: 'Súmula criada com sucesso.' })
  create(@Body() createMatchReportDto: CreateMatchReportDto, @Req() req: Request & { user?: { id?: number } }) {
    const user = req.user;
    if (!user?.id) {
      throw new UnauthorizedException('Usuário não autenticado para enviar súmula');
    }
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
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 200, description: 'Súmula encontrada.' })
  @ApiResponse({ status: 404, description: 'Súmula não encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.matchReportService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma súmula por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateMatchReportDto })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 200, description: 'Súmula atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Súmula não encontrada.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMatchReportDto: UpdateMatchReportDto) {
    return this.matchReportService.update(id, updateMatchReportDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma súmula por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 200, description: 'Súmula removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Súmula não encontrada.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.matchReportService.remove(id);
  }

  @Get('my-matches/:delegateId')
  @ApiOperation({ summary: 'Lista partidas atribuídas ao delegado' })
  @ApiParam({ name: 'delegateId', type: Number })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 200, description: 'Partidas atribuídas retornadas com sucesso.' })
  getMyMatches(@Param('delegateId', ParseIntPipe) delegateId: number) {
    return this.matchReportService.getAssignedMatches(delegateId);
  }

  @Patch(':id/review')
  @ApiOperation({ summary: 'Revisa uma súmula (aceita ou rejeita)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: ReviewMatchReportDto })
  @ApiResponse({ status: 400, description: 'ID inválido ou body inválido.' })
  @ApiResponse({ status: 200, description: 'Súmula revisada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Súmula não encontrada.' })
  review(@Param('id', ParseIntPipe) id: number, @Body() dto: ReviewMatchReportDto) {
    return this.matchReportService.review(id, dto);
  }
}
