import { Test, TestingModule } from '@nestjs/testing';
import { MatchReportService } from './match-report.service';

describe('MatchReportService', () => {
  let service: MatchReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchReportService],
    }).compile();

    service = module.get<MatchReportService>(MatchReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
