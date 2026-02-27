import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserResponseDto {
  @ApiProperty({ example: 7 })
  id: number;

  @ApiProperty({ example: true })
  deleted: boolean;
}
