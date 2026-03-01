import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';

describe('PlayerController', () => {
  let controller: PlayerController;
  let playerService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    playerService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [{ provide: PlayerService, useValue: playerService }],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
  });

  it('delegates create to service', async () => {
    const dto = { name: 'João', teamId: 1 } as any;
    const expected = { id: 1, ...dto };
    playerService.create.mockResolvedValue(expected);

    const result = await controller.create(dto);

    expect(playerService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('delegates findOne with numeric id', async () => {
    playerService.findOne.mockResolvedValue({ id: 22, name: 'Carlos' });

    const result = await controller.findOne(22);

    expect(playerService.findOne).toHaveBeenCalledWith(22);
    expect(result).toEqual({ id: 22, name: 'Carlos' });
  });

  it('delegates remove to service', async () => {
    const deleted = { id: 4, name: 'Deleted' };
    playerService.remove.mockResolvedValue(deleted);

    const result = await controller.remove(4);

    expect(playerService.remove).toHaveBeenCalledWith(4);
    expect(result).toEqual(deleted);
  });
});
