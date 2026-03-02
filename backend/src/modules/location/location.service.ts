import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import configuration from '../../config/configuration';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationService {
  private readonly locationImageUrlMaxLength = configuration().locationImageUrlMaxLength;

  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto) {
    this.validateImageUrlLength(createLocationDto.imageUrl);

    const location = this.locationRepository.create({
      ...createLocationDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.locationRepository.save(location);
  }

  async findAll() {
    const locations = await this.locationRepository.find({
      relations: ['matches'],
      order: { id: 'ASC' },
    });

    if (!locations || locations.length === 0) {
      throw new HttpException('No locations found', 404);
    }

    return locations;
  }

  async findOne(id: number) {
    const location = await this.locationRepository.findOne({
      where: { id },
      relations: ['matches'],
    });

    if (!location) {
      throw new HttpException(`Location with ID ${id} not found`, 404);
    }

    return location;
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    this.validateImageUrlLength(updateLocationDto.imageUrl);

    const location = await this.locationRepository.preload({
      id,
      ...updateLocationDto,
      updatedAt: new Date(),
    });

    if (!location) {
      throw new HttpException(`Location with ID ${id} not found`, 404);
    }

    return this.locationRepository.save(location);
  }

  async remove(id: number) {
    const location = await this.findOne(id);

    if (location.matches && location.matches.length > 0) {
      throw new HttpException('Cannot delete location with matches linked', 409);
    }

    return this.locationRepository.remove(location);
  }

  private validateImageUrlLength(imageUrl?: string) {
    if (!imageUrl) {
      return;
    }

    if (imageUrl.length > this.locationImageUrlMaxLength) {
      throw new BadRequestException(
        `imageUrl deve ter no máximo ${this.locationImageUrlMaxLength} caracteres`,
      );
    }
  }
}
