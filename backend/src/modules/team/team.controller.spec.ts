import { Test, TestingModule } from '@nestjs/testing';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

describe('TeamController', () => {
  let controller: TeamController;
  let teamService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    teamService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [{ provide: TeamService, useValue: teamService }],
    }).compile();

    controller = module.get<TeamController>(TeamController);
  });

  it('delegates create to service', async () => {
    const dto = { name: 'Time A', clubId: 10 } as any;
    const expected = { id: 1, ...dto };
    teamService.create.mockResolvedValue(expected);

    const result = await controller.create(dto);

    expect(teamService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('delegates update with id and dto', async () => {
    const dto = { coachName: 'Tite' } as any;
    const expected = { id: 2, name: 'Time B', coachName: 'Tite' };
    teamService.update.mockResolvedValue(expected);

    const result = await controller.update(2, dto);

    expect(teamService.update).toHaveBeenCalledWith(2, dto);
    expect(result).toEqual(expected);
  });

  it('delegates findAll to service', async () => {
    const expected = [{ id: 1 }, { id: 2 }];
    teamService.findAll.mockResolvedValue(expected);

    const result = await controller.findAll();

    expect(teamService.findAll).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });
});
