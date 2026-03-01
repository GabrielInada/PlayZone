import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';

describe('CardController', () => {
  let controller: CardController;
  let cardService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    cardService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
      providers: [{ provide: CardService, useValue: cardService }],
    }).compile();

    controller = module.get<CardController>(CardController);
  });

  it('delegates create to service', async () => {
    const dto: any = { minute: 10, type: 'yellow', playerId: 1 };
    const expected = { id: 1, ...dto };
    cardService.create.mockResolvedValue(expected);

    const result = await controller.create(dto);

    expect(cardService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('delegates findOne with id', async () => {
    cardService.findOne.mockResolvedValue({ id: 7 });

    const result = await controller.findOne(7);

    expect(cardService.findOne).toHaveBeenCalledWith(7);
    expect(result).toEqual({ id: 7 });
  });

  it('delegates remove with id', async () => {
    cardService.remove.mockResolvedValue({ id: 9 });

    const result = await controller.remove(9);

    expect(cardService.remove).toHaveBeenCalledWith(9);
    expect(result).toEqual({ id: 9 });
  });
});
