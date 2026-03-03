import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from './user-response.dto';

export class PaginationMetaDto {
  @ApiProperty({ example: 120, minimum: 0 })
  @Expose()
  @Type(() => Number)
  total: number;

  @ApiProperty({ example: 1, minimum: 1 })
  @Expose()
  @Type(() => Number)
  page: number;

  @ApiProperty({ example: 12, minimum: 1 })
  @Expose()
  @Type(() => Number)
  lastPage: number;

  @ApiProperty({ example: 10, minimum: 1 })
  @Expose()
  @Type(() => Number)
  size: number;
}

export class FindAllUsersResponseDto {
  @ApiProperty({ type: () => [UserResponseDto] })
  @Expose()
  @Type(() => UserResponseDto)
  data: UserResponseDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  @Expose()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;
}
