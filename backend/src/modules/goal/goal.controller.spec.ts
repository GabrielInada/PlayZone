import { Test, TestingModule } from '@nestjs/testing';
import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';

describe('GoalController', () => {
  let controller: GoalController;
  let goalService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    goalService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoalController],
      providers: [{ provide: GoalService, useValue: goalService }],
    }).compile();

    controller = module.get<GoalController>(GoalController);
  });

  it('delegates create to service', async () => {
    const dto: any = { minute: 30, playerId: 2, type: 'normal' };
    const expected = { id: 1, ...dto };
    goalService.create.mockResolvedValue(expected);

    const result = await controller.create(dto);

    expect(goalService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('delegates update with id and dto', async () => {
    const dto: any = { minute: 35 };
    const expected = { id: 3, minute: 35 };
    goalService.update.mockResolvedValue(expected);

    const result = await controller.update(3, dto);

    expect(goalService.update).toHaveBeenCalledWith(3, dto);
    expect(result).toEqual(expected);
  });

  it('delegates findAll to service', async () => {
    const expected = [{ id: 1 }, { id: 2 }];
    goalService.findAll.mockResolvedValue(expected);

    const result = await controller.findAll();

    expect(goalService.findAll).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });
});
