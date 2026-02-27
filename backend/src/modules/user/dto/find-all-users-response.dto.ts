import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class PaginationMetaDto {
  @ApiProperty({ example: 120 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 12 })
  lastPage: number;

  @ApiProperty({ example: 10 })
  size: number;
}

export class FindAllUsersResponseDto {
  @ApiProperty({ type: () => [UserResponseDto] })
  data: UserResponseDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta: PaginationMetaDto;
}
