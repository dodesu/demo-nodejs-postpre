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
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';

// internal
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { SearchBookDto } from './dto/search-book.dto';

@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) { }

    @UseGuards(OptionalJwtAuthGuard)
    @Get()
    getAll(@Query() dto: SearchBookDto, @CurrentUser() user) {
        const undefinedCount = Object.values(dto).filter((v) => v === undefined).length;
        const haveDefaultValue = 3; // sort, page, limit
        const hasQuery = undefinedCount < Object.keys(dto).length - haveDefaultValue;

        if (hasQuery) {
            return this.bookService.searchAdvanced(dto, user);
        }

        return this.bookService.getAll(user);
    }

    // #Important note: Place '/search' before '/:id'. If not, it will be matched to '/:id', and it error
    @UseGuards(OptionalJwtAuthGuard)
    @Get('search')
    search(@Query() dto: SearchBookDto, @CurrentUser() user) {
        return this.bookService.search(dto, user);
    }

    @UseGuards(OptionalJwtAuthGuard)
    @Get(':id')
    getById(@Param('id') id: number, @CurrentUser() user) {
        return this.bookService.getById(+id, user);
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
