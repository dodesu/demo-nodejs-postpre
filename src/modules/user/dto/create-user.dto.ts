import { IsString, IsEmail, Length, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { Role } from '../constants/role.enum';
import { Transform } from 'class-transformer';

export class CreateUserDto {

    @IsString()
    @Length(3, 50)
    username: string;

    @IsOptional()
    @IsEmail()
    @Length(5, 255)
    email?: string;

    @IsString()
    @Length(6, 60)
    password: string;

    @IsOptional()
    @Transform(({ value }) => value?.toLowerCase())
    @IsEnum(Role, { message: `Role must be ${Object.values(Role).join(', ')}` })
    @MaxLength(20)
    role?: Role;
}