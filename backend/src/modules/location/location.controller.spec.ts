import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

describe('LocationController', () => {
  let controller: LocationController;
  let locationService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    locationService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [{ provide: LocationService, useValue: locationService }],
    }).compile();

    controller = module.get<LocationController>(LocationController);
  });

  it('delegates create to service', async () => {
    const dto: any = { name: 'Arena', city: 'Belém' };
    const expected = { id: 1, ...dto };
    locationService.create.mockResolvedValue(expected);

    const result = await controller.create(dto);

    expect(locationService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('delegates findOne with id', async () => {
    locationService.findOne.mockResolvedValue({ id: 12, name: 'Arena' });

    const result = await controller.findOne(12);

    expect(locationService.findOne).toHaveBeenCalledWith(12);
    expect(result).toEqual({ id: 12, name: 'Arena' });
  });

  it('delegates remove with id', async () => {
    locationService.remove.mockResolvedValue({ id: 12 });

    const result = await controller.remove(12);

    expect(locationService.remove).toHaveBeenCalledWith(12);
    expect(result).toEqual({ id: 12 });
  });
});
