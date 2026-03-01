import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MatchReportService } from './match-report.service';
import { Match } from '../match/entities/match.entity';
import { MatchReport } from './entities/match-report.entity';
import { EnumMatchStatus } from '../../types/match';
import { EnumReviewAction } from '../../types/reviewMatchReport';

describe('MatchReportService', () => {
  let service: MatchReportService;
  let matchRepository: { update: jest.Mock; findOne: jest.Mock; find: jest.Mock };
  let matchReportRepository: { findOne: jest.Mock; remove: jest.Mock; save: jest.Mock; find: jest.Mock };

  beforeEach(async () => {
    matchRepository = {
      update: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };

    matchReportRepository = {
      findOne: jest.fn(),
      remove: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchReportService,
        { provide: getRepositoryToken(Match), useValue: matchRepository },
        { provide: getRepositoryToken(MatchReport), useValue: matchReportRepository },
        { provide: DataSource, useValue: { createQueryRunner: jest.fn() } },
      ],
    }).compile();

    service = module.get<MatchReportService>(MatchReportService);
  });

  it('throws 404 when findOne cannot find report', async () => {
    matchReportRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(123)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws 400 when rejecting report without reason', async () => {
    matchReportRepository.findOne.mockResolvedValue({ id: 1, status: 'pending' });

    await expect(
      service.review(1, {
        action: EnumReviewAction.REJECT,
      } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('removes report and resets match status to scheduled', async () => {
    matchReportRepository.findOne.mockResolvedValue({ id: 7, matchId: 99 });
    matchReportRepository.remove.mockResolvedValue(undefined);
    matchRepository.update.mockResolvedValue(undefined);

    const result = await service.remove(7);

    expect(matchReportRepository.remove).toHaveBeenCalledWith({ id: 7, matchId: 99 });
    expect(matchRepository.update).toHaveBeenCalledWith(99, { status: EnumMatchStatus.SCHEDULED });
    expect(result).toEqual({ message: 'Súmula removida com sucesso' });
  });
});
