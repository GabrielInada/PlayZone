import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@ApiTags('Goal')
@Controller('goal')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um registro de gol' })
  @ApiBody({ type: CreateGoalDto })
  @ApiResponse({ status: 201, description: 'Gol criado com sucesso.' })
  create(@Body() createGoalDto: CreateGoalDto) {
    return this.goalService.create(createGoalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os gols' })
  @ApiResponse({ status: 200, description: 'Lista de gols retornada com sucesso.' })
  findAll() {
    return this.goalService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um gol por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Gol encontrado.' })
  @ApiResponse({ status: 404, description: 'Gol não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.goalService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um gol por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateGoalDto })
  @ApiResponse({ status: 200, description: 'Gol atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Gol não encontrado.' })
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    return this.goalService.update(+id, updateGoalDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um gol por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Gol removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Gol não encontrado.' })
  remove(@Param('id') id: string) {
    return this.goalService.remove(+id);
  }
}
