import { Test, TestingModule } from '@nestjs/testing';
import { StandingsController } from './standings.controller';
import { StandingsService } from './standings.service';

describe('StandingsController', () => {
  let controller: StandingsController;
  let standingsService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    standingsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StandingsController],
      providers: [{ provide: StandingsService, useValue: standingsService }],
    }).compile();

    controller = module.get<StandingsController>(StandingsController);
  });

  it('delegates findAll to service', async () => {
    const expected = [{ id: 1, points: 3 }];
    standingsService.findAll.mockResolvedValue(expected);

    const result = await controller.findAll();

    expect(standingsService.findAll).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });

  it('delegates findOne with id', async () => {
    const expected = { id: 5, points: 10 };
    standingsService.findOne.mockResolvedValue(expected);

    const result = await controller.findOne(5);

    expect(standingsService.findOne).toHaveBeenCalledWith(5);
    expect(result).toEqual(expected);
  });

  it('delegates unsupported update path to service', async () => {
    const dto = { points: 999 } as any;
    standingsService.update.mockImplementation(() => {
      throw new Error('unsupported');
    });

    expect(() => controller.update(1, dto)).toThrow('unsupported');
    expect(standingsService.update).toHaveBeenCalledWith(1, dto);
  });
});
