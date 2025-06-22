import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { CreateGenreDto } from './dto/create-genre';
import { UpdateGenreDto } from './dto/update-genre';

@Injectable()
export class GenreService {
    constructor(
        @InjectRepository(Genre)
        private readonly genreRepository: Repository<Genre>
    ) { }

    getAll() {
        return this.genreRepository.find({ order: { id: 'ASC' } });
    }

    getById(id: number) {
        return this.genreRepository.findOneBy({ id });
    }

    create(dto: CreateGenreDto) {
        const { name } = dto;
        const genre = this.genreRepository.create({ name });

        return this.genreRepository.save(genre);
    }

    async update(id: number, dto: UpdateGenreDto) {
        const { name } = dto;
        const genre = await this.genreRepository.preload({ id, name });

        if (!genre) {
            throw new NotFoundException(`Genre with id ${id} not found`);
        }

        return this.genreRepository.save(genre);
    }

    async delete(id: number) {
        const result = await this.genreRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Genre with id ${id} not found`);
        }
    }
}
