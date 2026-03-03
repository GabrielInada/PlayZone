import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EnumUserRole, EnumUserType } from '../../../types/user';
import { Type } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({ example: 1, minimum: 1 })
  @Expose()
  @Type(() => Number)
  id: number;

  @ApiProperty({ example: 'gabrielinada@email.com' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'Gabriel Inada' })
  @Expose()
  name: string;

  @ApiProperty({ enum: EnumUserRole, example: EnumUserRole.USER })
  @Expose()
  role: EnumUserRole;

  @ApiProperty({ enum: EnumUserType, example: EnumUserType.DELEGADO })
  @Expose()
  type: EnumUserType;

  @ApiProperty({
    example: '2026-02-27T12:00:00.000Z',
    format: 'date-time',
  })
  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    example: '2026-02-27T12:00:00.000Z',
    format: 'date-time',
  })
  @Expose()
  @Type(() => Date)
  updatedAt: Date;

  @Exclude()
  password: string;
}
