import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { LocationService } from './location.service';
import { Location } from './entities/location.entity';

describe('LocationService', () => {
  let service: LocationService;
  let locationRepository: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    preload: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    locationRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      preload: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        { provide: getRepositoryToken(Location), useValue: locationRepository },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
  });

  it('throws 404 when no locations exist in findAll', async () => {
    locationRepository.find.mockResolvedValue([]);

    await expect(service.findAll()).rejects.toBeInstanceOf(HttpException);
  });

  it('creates and saves a location', async () => {
    const created = { id: 1, name: 'Arena' };
    const saved = { id: 1, name: 'Arena', address: 'Av. Perimetral, 2501' };

    locationRepository.create.mockReturnValue(created);
    locationRepository.save.mockResolvedValue(saved);

    const result = await service.create({
      name: 'Arena',
      address: 'Av. Perimetral, 2501',
    } as any);

    expect(locationRepository.create).toHaveBeenCalled();
    expect(locationRepository.save).toHaveBeenCalledWith(created);
    expect(result).toEqual(saved);
  });

  it('throws 400 when imageUrl exceeds configured max length', async () => {
    const oversizedImageUrl = 'a'.repeat(200001);

    await expect(
      service.create({ name: 'Arena', imageUrl: oversizedImageUrl } as any),
    ).rejects.toBeInstanceOf(HttpException);
  });

  it('throws 409 when removing a location linked to matches', async () => {
    locationRepository.findOne.mockResolvedValue({
      id: 4,
      matches: [{ id: 11 }],
    });

    await expect(service.remove(4)).rejects.toBeInstanceOf(HttpException);
  });
});
