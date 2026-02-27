import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'gabrielinada@email.com' })
  email: string;

  @ApiProperty({ example: 'kjsupremacy2026' })
  password: string;
}