import { IsString, Length } from 'class-validator';

export class CreateAuthorDto {

    @IsString()
    @Length(2, 255)
    name: string;
}
