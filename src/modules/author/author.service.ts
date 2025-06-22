import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthorService {

    constructor(
        @InjectRepository(Author)
        private readonly authorRepository: Repository<Author>
    ) { }

    getAll() {
        return this.authorRepository.find();
    }

    async getById(id: number) {
        const author = await this.authorRepository.findOneBy({ id });
        if (!author) {
            throw new NotFoundException(`Author with id ${id} not found`);
        }

        return author;
    }

    create(dto: CreateAuthorDto) {
        const { name } = dto;
        const author = this.authorRepository.create({ name });

        return this.authorRepository.save(author);
    }

    async update(id: number, dto: UpdateAuthorDto) {
        const { name } = dto;
        const author = await this.authorRepository.preload({ id, name });

        if (!author) {
            throw new NotFoundException(`Author with id ${id} not found`);
        }

        return this.authorRepository.save(author);
    }

    async delete(id: number) {
        const result = await this.authorRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Author with id ${id} not found`);
        }
    }
}
