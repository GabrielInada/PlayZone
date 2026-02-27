import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { EnumUserRole, EnumUserType } from '../../../types/user';

export class CreateUserDto {
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

	@ApiProperty({ enum: EnumUserRole, example: EnumUserRole.USER })
	@IsEnum(EnumUserRole)
	role: EnumUserRole;

	@ApiProperty({ enum: EnumUserType, example: EnumUserType.DELEGADO })
	@IsEnum(EnumUserType)
	type: EnumUserType;
}
