import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Club } from '../club/entities/club.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Club])],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
