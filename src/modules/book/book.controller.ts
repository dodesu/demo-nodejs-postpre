import {
    Controller,
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

@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) { }

    @Get()
    getAll() {
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
}
