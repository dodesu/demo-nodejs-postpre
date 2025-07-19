import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreResponseDto } from './dto/genre-response.dto';

@Injectable()
export class GenreService {
    constructor(
        @InjectRepository(Genre)
        private readonly genreRepository: Repository<Genre>
    ) { }

    async getAll() {
        const genres = await this.genreRepository.find({ order: { id: 'ASC' } });

        return genres.map((genre) => new GenreResponseDto(genre));
    }

    async getById(id: number) {
        const genre = await this.genreRepository.findOneBy({ id });

        if (!genre) {
            throw new NotFoundException(`Genre with id ${id} not found`);
        }

        return new GenreResponseDto(genre);
    }

    async create(dto: CreateGenreDto) {
        const { name } = dto;
        const genre = this.genreRepository.create({ name });

        const saved = await this.genreRepository.save(genre);

        return new GenreResponseDto(saved);
    }

    async update(id: number, dto: UpdateGenreDto) {
        const { name } = dto;
        const genre = await this.genreRepository.preload({ id, name });

        if (!genre) {
            throw new NotFoundException(`Genre with id ${id} not found`);
        }

        const updated = await this.genreRepository.save(genre);

        return new GenreResponseDto(updated);
    }

    async delete(id: number) {
        const result = await this.genreRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Genre with id ${id} not found`);
        }
    }
}
