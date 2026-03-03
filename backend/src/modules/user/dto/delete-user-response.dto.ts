import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class DeleteUserResponseDto {
  @ApiProperty({ example: 7, minimum: 1 })
  @Expose()
  @Type(() => Number)
  id: number;

  @ApiProperty({ example: true })
  @Expose()
  deleted: boolean;
}
