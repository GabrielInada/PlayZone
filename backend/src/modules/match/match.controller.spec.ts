import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

describe('MatchController', () => {
  let controller: MatchController;
  let matchService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    matchService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [{ provide: MatchService, useValue: matchService }],
    }).compile();

    controller = module.get<MatchController>(MatchController);
  });

  it('delegates create to service', async () => {
    const dto: any = {
      date: new Date('2026-03-10T19:00:00.000Z'),
      locationId: 1,
      homeTeamId: 2,
      awayTeamId: 3,
    };
    const expected = { id: 1, ...dto };
    matchService.create.mockResolvedValue(expected);

    const result = await controller.create(dto);

    expect(matchService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('delegates update with id and dto', async () => {
    const dto: any = { status: 'finished' };
    const expected = { id: 1, status: 'finished' };
    matchService.update.mockResolvedValue(expected);

    const result = await controller.update(1, dto);

    expect(matchService.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(expected);
  });

  it('delegates findOne with id', async () => {
    matchService.findOne.mockResolvedValue({ id: 5 });

    const result = await controller.findOne(5);

    expect(matchService.findOne).toHaveBeenCalledWith(5);
    expect(result).toEqual({ id: 5 });
  });
});
