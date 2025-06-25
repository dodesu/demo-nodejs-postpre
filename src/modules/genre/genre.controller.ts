import {
    Controller,
    Param,
    Body,
    Get,
    Patch,
    Delete,
    HttpCode,
    Post,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Controller('genres')
export class GenreController {
    constructor(private readonly genreService: GenreService) { }

    @Get()
    getAll() {
        return this.genreService.getAll();
    }

    @Get(':id')
    getById(@Param('id') id: number) {
        return this.genreService.getById(+id);
    }

    @Post()
    create(@Body() dto: CreateGenreDto) {
        return this.genreService.create(dto);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: UpdateGenreDto) {
        return this.genreService.update(+id, dto);
    }

    @Delete(':id')
    @HttpCode(204)
    delete(@Param('id') id: number) {
        return this.genreService.delete(+id);
    }
}
