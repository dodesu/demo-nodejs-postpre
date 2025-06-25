import { IsString, IsEmail, IsOptional, Length } from 'class-validator';

export class RegisterDto {
    @IsString()
    @Length(3, 50)
    username: string;

    @IsOptional()
    @Length(5, 255)
    @IsEmail()
    email: string;

    @IsString()
    @Length(6, 60)
    password: string;

    @IsString()
    @Length(6, 60)
    confirmPassword: string;
}
