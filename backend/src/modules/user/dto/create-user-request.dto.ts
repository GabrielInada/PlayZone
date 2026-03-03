import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EnumUserType } from '../../../types/user';

export class CreateUserRequestDto {
  @ApiProperty({ example: 'Gabriel Inada' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'gabrielinada@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'kjsupremacy2026' })
  @IsString()
  @MinLength(6)
  @MaxLength(120)
  password: string;

  @ApiProperty({ enum: EnumUserType, example: EnumUserType.DELEGADO })
  @IsEnum(EnumUserType)
  type: EnumUserType;
}
