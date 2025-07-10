import { Controller, Get, Query } from '@nestjs/common';
import { Render, UseGuards } from '@nestjs/common/decorators';
import { ViewService } from './view.service';
import { BookService } from '../book/book.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { SearchBookDto } from '../book/dto/search-book.dto';

@Controller()
export class ViewController {
    constructor(
        private readonly viewService: ViewService,
        private readonly bookService: BookService
    ) { }

    @Get('home')
    @Render('home')
    @UseGuards(OptionalJwtAuthGuard)
    async home(@CurrentUser() user) {

        return { books: await this.bookService.getAll(user) };
    }

    @Get('result')
    @Render('result')
    @UseGuards(OptionalJwtAuthGuard)
    async result(@Query() dto: SearchBookDto, @CurrentUser() user) {
        const result = await this.bookService.search(dto)
        return { result: result };
    }


}
