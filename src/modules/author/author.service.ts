import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';
import { AuthorResponseDto } from './dto/author-response.dto';


@Injectable()
export class AuthorService {

    constructor(
        @InjectRepository(Author)
        private readonly authorRepository: Repository<Author>
    ) { }

    async getAll() {
        const authors = await this.authorRepository.find({ order: { id: 'ASC' } });
        return authors.map((author) => new AuthorResponseDto(author));
    }

    async getById(id: number) {
        const author = await this.authorRepository.findOneBy({ id });
        if (!author) {
            throw new NotFoundException(`Author with id ${id} not found`);
        }

        return new AuthorResponseDto(author);
    }

    async create(dto: CreateAuthorDto) {
        const { name } = dto;
        const author = this.authorRepository.create({ name });

        const saved = await this.authorRepository.save(author);

        return new AuthorResponseDto(saved);
    }

    async update(id: number, dto: UpdateAuthorDto) {
        const { name } = dto;
        const author = await this.authorRepository.preload({ id, name });

        if (!author) {
            throw new NotFoundException(`Author with id ${id} not found`);
        }

        if (name) author.name = name;

        const upated = await this.authorRepository.save(author);

        return new AuthorResponseDto(upated);
    }

    async delete(id: number) {
        const result = await this.authorRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Author with id ${id} not found`);
        }
    }
}
