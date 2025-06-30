import {
    Controller,
    Query,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Body,
    HttpCode,
    UseGuards
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { SearchBookDto } from './dto/search-book.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) { }

    @Get()
    getAll(@Query() dto: SearchBookDto) {
        const undefinedCount = Object.values(dto).filter((v) => v === undefined).length;
        const haveDefaultValue = 3; // sort, page, limit
        const hasQuery = undefinedCount < Object.keys(dto).length - haveDefaultValue;

        if (hasQuery) {
            console.log(dto);
            return this.bookService.searchAdvanced(dto);
        }

        return this.bookService.getAll();
    }

    // #Important note: Place '/search' before '/:id'. If not, it will be matched to '/:id', and it error
    @Get('search')
    search(@Query() dto: SearchBookDto) {
        return this.bookService.search(dto);
    }

    @Get(':id')
    getById(@Param('id') id: number) {
        return this.bookService.getById(+id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Body() dto: CreateBookDto, @CurrentUser() user) {
        return this.bookService.create(dto, user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: UpdateBookDto, @CurrentUser() user) {
        return this.bookService.update(+id, dto, user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    @HttpCode(204)
    delete(@Param('id') id: number, @CurrentUser() user) {
        return this.bookService.delete(+id, user);
    }


}
