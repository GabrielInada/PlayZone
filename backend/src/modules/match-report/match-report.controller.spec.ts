import { Test, TestingModule } from '@nestjs/testing';
import { MatchReportController } from './match-report.controller';
import { MatchReportService } from './match-report.service';

describe('MatchReportController', () => {
  let controller: MatchReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchReportController],
      providers: [MatchReportService],
    }).compile();

    controller = module.get<MatchReportController>(MatchReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
