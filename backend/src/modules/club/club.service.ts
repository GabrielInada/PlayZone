import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnumUserType } from '../../types/user';
import { Repository } from 'typeorm';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Club } from './entities/club.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Club)
    private readonly clubRepository: Repository<Club>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createClubDto: CreateClubDto) {
    await this.validateClubOwner(createClubDto.ownerUserId);

    const exists = await this.clubRepository.findOne({
      where: { ownerUserId: createClubDto.ownerUserId },
    });

    if (exists) {
      throw new HttpException(
        `User ${createClubDto.ownerUserId} already has a club profile`,
        409,
      );
    }

    const club = this.clubRepository.create({
      ...createClubDto,
      badgeImage: createClubDto.badgeImage ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.clubRepository.save(club);
  }

  async findAll() {
    const clubs = await this.clubRepository.find({
      relations: ['owner', 'teams'],
      order: { id: 'ASC' },
    });

    if (!clubs || clubs.length === 0) {
      throw new HttpException('No clubs found', 404);
    }

    return clubs;
  }

  async findOne(id: number) {
    const club = await this.clubRepository.findOne({
      where: { id },
      relations: ['owner', 'teams'],
    });

    if (!club) {
      throw new HttpException(`Club with ID ${id} not found`, 404);
    }

    return club;
  }

  async findByOwnerUserId(ownerUserId: number) {
    const club = await this.clubRepository.findOne({
      where: { ownerUserId },
      relations: ['owner', 'teams'],
    });

    if (!club) {
      throw new HttpException(`Club profile for user ${ownerUserId} not found`, 404);
    }

    return club;
  }

  async update(id: number, updateClubDto: UpdateClubDto) {
    const existingClub = await this.findOne(id);

    if (updateClubDto.ownerUserId !== undefined && updateClubDto.ownerUserId !== existingClub.ownerUserId) {
      await this.validateClubOwner(updateClubDto.ownerUserId);

      const ownerAlreadyLinked = await this.clubRepository.findOne({
        where: { ownerUserId: updateClubDto.ownerUserId },
      });

      if (ownerAlreadyLinked) {
        throw new HttpException(`User ${updateClubDto.ownerUserId} already has a club profile`, 409);
      }
    }

    const club = await this.clubRepository.preload({
      id,
      ...updateClubDto,
      updatedAt: new Date(),
    });

    if (!club) {
      throw new HttpException(`Club with ID ${id} not found`, 404);
    }

    return this.clubRepository.save(club);
  }

  async remove(id: number) {
    const club = await this.findOne(id);

    if (club.teams && club.teams.length > 0) {
      throw new HttpException('Cannot delete club with teams linked. Remove or reassign teams first.', 409);
    }

    return this.clubRepository.remove(club);
  }

  private async validateClubOwner(ownerUserId: number) {
    const owner = await this.userRepository.findOne({ where: { id: ownerUserId } });

    if (!owner) {
      throw new HttpException(`User with ID ${ownerUserId} not found`, 404);
    }

    if (owner.type !== EnumUserType.CLUBE) {
      throw new HttpException('Club profile can only be linked to users with type=clube', 400);
    }
  }
}
