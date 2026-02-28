import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'gabrielinada@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'kjsupremacy2026' })
  @IsString()
  @MinLength(6)
  password: string;
}