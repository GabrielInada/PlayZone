import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamResponseDto } from './dto/team-response.dto';

@ApiTags('Team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new team' })
  @ApiBody({ type: CreateTeamDto })
  @ApiResponse({ status: 201, description: 'Team created successfully', type: TeamResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 404, description: 'Club not found' })
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teams' })
  @ApiResponse({ status: 200, description: 'List of all teams', type: [TeamResponseDto] })
  @ApiOkResponse({
    description: 'Example list of teams',
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
  @ApiResponse({ status: 404, description: 'No teams found' })
  findAll() {
    return this.teamService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a team by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Team ID' })
  @ApiResponse({ status: 400, description: 'Invalid team ID' })
  @ApiResponse({ status: 200, description: 'Team found', type: TeamResponseDto })
  @ApiOkResponse({
    description: 'Example team response',
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
  @ApiResponse({ status: 404, description: 'Team not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teamService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a team by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Team ID' })
  @ApiBody({ type: UpdateTeamDto })
  @ApiResponse({ status: 400, description: 'Invalid team ID' })
  @ApiResponse({ status: 200, description: 'Team updated successfully', type: TeamResponseDto })
  @ApiResponse({ status: 404, description: 'Team or club not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(id, updateTeamDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a team by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Team ID' })
  @ApiResponse({ status: 400, description: 'Invalid team ID' })
  @ApiResponse({ status: 200, description: 'Team deleted successfully', type: TeamResponseDto })
  @ApiResponse({ status: 404, description: 'Team not found' })
  @ApiResponse({ status: 409, description: 'Cannot delete team with players' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teamService.remove(id);
  }
}
