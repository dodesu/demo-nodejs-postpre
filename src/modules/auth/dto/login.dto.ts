import { IsString, Length, MaxLength } from 'class-validator';

export class LoginDto {

    @IsString()
    @MaxLength(255)
    usernameOrEmail: string;

    @IsString()
    @Length(6, 60)
    password: string;
}