import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EnumUserRole } from '../../types/user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserDetails(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new HttpException(
        `User with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async getUserProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'assignedMatches',
        'assignedMatches.homeTeam',
        'assignedMatches.awayTeam',
        'assignedMatches.report',
      ],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const { password, ...result } = user;
    return result;
  }

  async create(createUserDto: CreateUserRequestDto) {
    return this.createWithRole(createUserDto, EnumUserRole.USER);
  }

  async createWithRole(createUserDto: CreateUserRequestDto, role: EnumUserRole) {
    const user = this.userRepository.create({
      ...(createUserDto as Partial<User>),
      email: createUserDto.email.toLowerCase(),
      role,
    });
    user.createdAt = new Date();
    user.updatedAt = new Date();
    return this.userRepository.save(user);
  }

  async findAll(page: number = 1, size: number = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
      order: { id: 'ASC' },
    });
    return {
      data: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / size),
        size,
      },
    };
  }

  async findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
      updatedAt: new Date(),
    });

    if (!user) {
      throw new HttpException(
        `User with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id);

    if (!result.affected) {
      throw new HttpException(
        `User with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return { id, deleted: true };
  }

   async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
}
