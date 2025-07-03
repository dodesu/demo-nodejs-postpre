import { Expose } from "class-transformer";
import { Type } from "class-transformer";
//Entities
import { Book } from "../entities/book.entity";
//Dtos
import { UserInBookDto } from "./user-in-book.dto";
import { AuthorResponseDto } from "../../author/dto/author-response.dto";
import { GenreResponseDto } from "src/modules/genre/dto/genre-response.dto";

export class BookResponseDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    publishedAt: Date;

    @Expose()
    createdAt: Date;

    @Expose()
    @Type(() => AuthorResponseDto)
    author: AuthorResponseDto;

    @Expose()
    @Type(() => GenreResponseDto)
    genres: GenreResponseDto[];

    @Expose()
    @Type(() => UserInBookDto)
    creator: UserInBookDto;

    @Expose()
    @Type(() => Boolean)
    isRead: boolean;

    constructor(book: Book, currentUserId?: number) {
        this.id = book.id;
        this.title = book.title;
        this.publishedAt = book.publishedAt;
        this.createdAt = book.createdAt;
        this.author = new AuthorResponseDto(book.author);
        this.genres = book.genres?.map((g) => new GenreResponseDto(g)) ?? [];
        this.creator = new UserInBookDto(book.creator);
        //notes: idk why if author/genres not use dto, it will undefined (in JSON response).

        if (currentUserId) {
            this.isRead = !!book.readers?.some((reader) => reader.id === currentUserId);
        }
    }
}