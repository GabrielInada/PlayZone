import { Module } from '@nestjs/common';
import { PlayersService } from './player.service';
import { PlayersController } from './player.controller';

@Module({
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
