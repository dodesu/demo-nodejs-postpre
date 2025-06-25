import { IsString, IsEmail, Length, IsOptional } from 'class-validator';

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
}