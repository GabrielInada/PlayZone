import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'Gabriel Inada' })
  name: string;

  @ApiProperty({ example: 'gabrielinada@email.com' })
  email: string;

  @ApiProperty({ example: 'kjsupremacy2026' })
  password: string;
}