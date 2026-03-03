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
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamResponseDto } from './dto/team-response.dto';

@ApiTags('Time')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo time' })
  @ApiBody({ type: CreateTeamDto })
  @ApiResponse({
    status: 201,
    description: 'Time criado com sucesso',
    type: TeamResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Requisição inválida - erro de validação' })
  @ApiResponse({ status: 404, description: 'Clube não encontrado' })
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os times' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos os times',
    type: [TeamResponseDto],
  })
  @ApiOkResponse({
    description: 'Exemplo de lista de times',
    schema: {
      example: [
        {
          id: 1,
          name: 'Flamengo FC',
          clubId: 1,
          coachName: 'Tite',
          createdAt: '2026-02-27T12:00:00.000Z',
          updatedAt: '2026-02-27T12:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 404, description: 'Nenhum time encontrado' })
  findAll() {
    return this.teamService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um time por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do time' })
  @ApiResponse({ status: 400, description: 'ID de time inválido' })
  @ApiResponse({
    status: 200,
    description: 'Time encontrado',
    type: TeamResponseDto,
  })
  @ApiOkResponse({
    description: 'Exemplo de resposta de time',
    schema: {
      example: {
        id: 1,
        name: 'Flamengo FC',
        clubId: 1,
        coachName: 'Tite',
        createdAt: '2026-02-27T12:00:00.000Z',
        updatedAt: '2026-02-27T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Time não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teamService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um time por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do time' })
  @ApiBody({ type: UpdateTeamDto })
  @ApiResponse({ status: 400, description: 'ID de time inválido' })
  @ApiResponse({
    status: 200,
    description: 'Time atualizado com sucesso',
    type: TeamResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Time ou clube não encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamService.update(id, updateTeamDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um time por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do time' })
  @ApiResponse({ status: 400, description: 'ID de time inválido' })
  @ApiResponse({
    status: 200,
    description: 'Time removido com sucesso',
    type: TeamResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Time não encontrado' })
  @ApiResponse({ status: 409, description: 'Não é possível remover time com jogadores' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teamService.remove(id);
  }
}
