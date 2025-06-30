import { Expose } from 'class-transformer';
import { Author } from '../entities/author.entity';


export class AuthorResponseDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    constructor(author: Author) {
        this.id = author.id;
        this.name = author.name;
    }
}
