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
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('authors')
export class AuthorController {

    constructor(private readonly authorService: AuthorService) { }

    @Get()
    getAll() {
        return this.authorService.getAll();
    }

    @Get(':id')
    getById(@Param('id') id: number) {
        return this.authorService.getById(+id);
    }

    @Post()
    create(@Body() dto: CreateAuthorDto) {
        return this.authorService.create(dto);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: UpdateAuthorDto) {
        return this.authorService.update(+id, dto);
    }

    @Delete(':id')
    @HttpCode(204)
    delete(@Param('id') id: number) {
        return this.authorService.delete(+id);
    }
}
