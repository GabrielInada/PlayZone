import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { Player } from './entities/player.entity';
import { Team } from '../team/entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Player, Team])],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
