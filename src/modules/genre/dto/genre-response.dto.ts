import { Expose } from 'class-transformer';
import { Genre } from '../entities/genre.entity';

export class GenreResponseDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    constructor(genre: Genre) {
        this.id = genre.id;
        this.name = genre.name;
    }
}