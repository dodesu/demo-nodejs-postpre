import { Controller, Get, Query } from '@nestjs/common';
import { Render, UseGuards } from '@nestjs/common/decorators';
//services
import { ViewService } from './view.service';
import { BookService } from '../book/book.service';
import { GenreService } from '../genre/genre.service';
import { AuthorService } from '../author/author.service';
//decorator
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { SearchBookDto } from '../book/dto/search-book.dto';

@Controller()
export class ViewController {
    constructor(
        private readonly viewService: ViewService,
        private readonly bookService: BookService,
        private readonly genreService: GenreService,
        private readonly authorService: AuthorService
    ) { }

    @Get(['', 'home'])
    @Render('home')
    async home() {
        return {
            books: await this.bookService.getAll()
        };
    }

    @Get('result')
    @Render('result')
    async result(@Query() dto: SearchBookDto) {
        const { keyword } = dto;
        let result;
        if (keyword) {
            result = await this.bookService.search(dto);
        } else {
            result = await this.bookService.searchAdvanced(dto);
        }

        const genres = await this.genreService.getAll();
        const authors = await this.authorService.getAll();
        return {
            result: result,
            genres: genres,
            authors: authors
        };
    }

    @Get('add-new-book')
    @Render('book-detail')
    async addNewBook() {
        const genres = await this.genreService.getAll();
        const authors = await this.authorService.getAll();
        return {
            authors: authors,
            genres: genres
        };
    }

    @Get('edit-book/:id')
    @Render('book-detail')
    async editBook() {
        const genres = await this.genreService.getAll();
        const authors = await this.authorService.getAll();
        return {
            authors: authors,
            genres: genres
        };
    }


}
