import {
    Controller,
    Query,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Body,
    HttpCode
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { SearchBookDto } from './dto/search-book.dto';

@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) { }

    @Get()
    getAll(@Query() dto: SearchBookDto) {
        const hasQuery = Object.keys(dto).length > 0;

        if (hasQuery) {
            return this.bookService.searchAdvanced(dto);
        }

        return this.bookService.getAll();
    }

    @Get(':id')
    getById(@Param('id') id: number) {
        return this.bookService.getById(+id);
    }

    @Post()
    create(@Body() dto: CreateBookDto) {
        return this.bookService.create(dto);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: UpdateBookDto) {
        return this.bookService.update(+id, dto);
    }

    @Delete(':id')
    @HttpCode(204)
    delete(@Param('id') id: number) {
        return this.bookService.delete(+id);
    }

    @Get('search')
    search(@Query() dto: SearchBookDto) {
        // return this.bookService.search(dto);
    }
}
