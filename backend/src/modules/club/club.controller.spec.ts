import { Test, TestingModule } from '@nestjs/testing';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';

describe('ClubController', () => {
  let controller: ClubController;
  let clubService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    findByOwnerUserId: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    clubService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByOwnerUserId: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubController],
      providers: [{ provide: ClubService, useValue: clubService }],
    }).compile();

    controller = module.get<ClubController>(ClubController);
  });

  it('delegates findByOwnerUserId', async () => {
    const expected = { id: 1, ownerUserId: 9 };
    clubService.findByOwnerUserId.mockResolvedValue(expected);

    const result = await controller.findByOwnerUserId(9);

    expect(clubService.findByOwnerUserId).toHaveBeenCalledWith(9);
    expect(result).toEqual(expected);
  });

  it('delegates update with id and dto', async () => {
    const dto: any = { name: 'Novo Clube' };
    const expected = { id: 2, name: 'Novo Clube' };
    clubService.update.mockResolvedValue(expected);

    const result = await controller.update(2, dto);

    expect(clubService.update).toHaveBeenCalledWith(2, dto);
    expect(result).toEqual(expected);
  });

  it('delegates remove with id', async () => {
    clubService.remove.mockResolvedValue({ id: 3 });

    const result = await controller.remove(3);

    expect(clubService.remove).toHaveBeenCalledWith(3);
    expect(result).toEqual({ id: 3 });
  });
});
