import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { MatchReportController } from './match-report.controller';
import { MatchReportService } from './match-report.service';

describe('MatchReportController', () => {
  let controller: MatchReportController;
  let matchReportService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
    getAssignedMatches: jest.Mock;
    review: jest.Mock;
  };

  beforeEach(async () => {
    matchReportService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      getAssignedMatches: jest.fn(),
      review: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchReportController],
      providers: [
        { provide: MatchReportService, useValue: matchReportService },
      ],
    }).compile();

    controller = module.get<MatchReportController>(MatchReportController);
  });

  it('throws unauthorized when create is called without user id', () => {
    expect(() => controller.create({ matchId: 1 } as any, {} as any)).toThrow(
      UnauthorizedException,
    );
  });

  it('delegates create with authenticated user id', async () => {
    const dto: any = {
      matchId: 2,
      homeScore: 1,
      awayScore: 0,
      goals: [],
      cards: [],
    };
    const expected = { id: 1, ...dto };
    matchReportService.create.mockResolvedValue(expected);

    const result = await controller.create(dto, { user: { id: 99 } } as any);

    expect(matchReportService.create).toHaveBeenCalledWith(99, dto);
    expect(result).toEqual(expected);
  });

  it('delegates review with id and dto', async () => {
    const dto: any = { action: 'accept' };
    const expected = { id: 10, status: 'validated' };
    matchReportService.review.mockResolvedValue(expected);

    const result = await controller.review(10, dto);

    expect(matchReportService.review).toHaveBeenCalledWith(10, dto);
    expect(result).toEqual(expected);
  });
});
