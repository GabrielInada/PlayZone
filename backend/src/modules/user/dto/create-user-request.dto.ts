import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { EnumUserType } from '../../../types/user';

export class CreateUserRequestDto {
	@ApiProperty({ example: 'Gabriel Inada' })
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({ example: 'gabrielinada@email.com' })
	@IsEmail()
	email: string;

	@ApiProperty({ example: 'kjsupremacy2026' })
	@IsString()
	@MinLength(6)
	password: string;

	@ApiProperty({ enum: EnumUserType, example: EnumUserType.DELEGADO })
	@IsEnum(EnumUserType)
	type: EnumUserType;
}
