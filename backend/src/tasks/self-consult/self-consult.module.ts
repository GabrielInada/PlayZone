import { Module } from '@nestjs/common';
import { SelfConsultService } from './self-consult.service';

@Module({
  providers: [SelfConsultService],
})
export class SelfConsultModule {}
