import {
    IsInt,
    IsOptional,
    ArrayUnique,
    IsIn,
    Min,
    Max,
    MaxLength,
    IsDate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class SearchBookDto {

    @IsOptional()
    // @MaxLength(255) 
    keyword?: string;

    @IsOptional()
    @MaxLength(255)
    title: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    authorId: number;

    @IsOptional()
    // @Type(() => Number) not correct
    // In case: only one ?genreIds=1, will error with @ArrayUnique. Cuz it not auto convert to array
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return [Number(value)];
        }
        return Array.isArray(value) ? value.map(Number) : [];
    })
    @IsInt({ each: true })
    @ArrayUnique()
    genreIds?: number[];

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    publishedFrom?: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    publishedTo?: Date;
    //fix later: custom validator for publishedFrom < publishedTo

    @IsOptional()
    @IsIn([
        'title_asc',
        'title_desc',
        'published_asc',
        'published_desc',
    ])
    sort?: 'title_asc' | 'title_desc' | 'published_asc' | 'published_desc';

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;
}
