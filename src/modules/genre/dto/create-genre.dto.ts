import { IsString, Length } from 'class-validator';

export class CreateGenreDto {

    @IsString()
    //Fix latter: Create a custom validator @IsNameUnique
    @Length(2, 255)
    name: string;
}
