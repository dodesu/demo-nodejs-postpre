import {
    IsString,
    IsInt,
    IsOptional,
    IsDateString,
    ArrayNotEmpty,
    ArrayUnique,
    IsDefined,
    Length,
    IsBoolean
} from 'class-validator';

export class CreateBookDto {

    @IsString()
    @Length(2, 255)
    title: string;

    @IsInt()
    @IsDefined()
    authorId: number;

    @IsOptional()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsInt({ each: true })
    genreIds?: number[];

    @IsOptional()
    @IsDateString()
    publishedAt?: Date;

    @IsOptional()
    @IsBoolean()
    isRead?: boolean = false;
}
