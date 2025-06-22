import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DataSource } from 'typeorm';
import { Book } from './entities/book.entity';
import { Author } from '../author/entities/author.entity';
import { Genre } from '../genre/entities/genre.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,

        @InjectRepository(Author)
        private readonly authorRepository: Repository<Author>,

        @InjectRepository(Genre)
        private readonly genreRepository: Repository<Genre>,

        private readonly dataSource: DataSource,
    ) { }

    async getAll() {
        return this.bookRepository.find({ relations: ['author', 'genres'] });
    }

    async getById(id: number) {
        const book = await this.bookRepository.findOne({
            where: { id },
            relations: ['author', 'genres'],
            order: {
                id: 'ASC'
            }
        });

        if (!book) {
            throw new NotFoundException(`Book with id ${id} not found`);
        }

        return book;
    }

    /**
     * Creates a new book record in the database.
     * 
     * @param dto - Data transfer object containing book details including:
     *   - title: The title of the book.
     *   - authorId: The ID of the author.
     *   - genreIds: An optional array of genre IDs.
     *   - publishedAt: An optional publication date of the book.
     * 
     * @throws NotFoundException if the specified author or any of the genre IDs do not exist.
     * 
     * @returns The newly created book entity.
     */
    async create(dto: CreateBookDto) {
        const { title, authorId, genreIds, publishedAt } = dto;

        const author = await this.authorRepository.findOneBy({ id: authorId });
        if (!author) throw new NotFoundException(`Author with id ${authorId} not found`);

        const genres = await this.genreRepository.findBy({
            id: In(genreIds || [])
        });
        this.validateGenreIdsOrThrow(genreIds || [], genres);


        const book = this.bookRepository.create({
            title,
            author,
            genres,
            publishedAt: publishedAt ? new Date(publishedAt) : undefined
        });

        return this.bookRepository.save(book);
    }

    /**
     * Updates an existing book record in the database.
     * 
     * @param id - The ID of the book to update.
     * @param dto - Data transfer object containing book details to update including:
     *   - title: The title of the book. Optional.
     *   - authorId: The ID of the author. Optional.
     *   - genreIds: An optional array of genre IDs.
     *   - publishedAt: An optional publication date of the book. Optional.
     * 
     * @throws NotFoundException if the specified book, author or any of the genre IDs do not exist.
     * 
     * @returns The updated book entity.
     */
    async update(id: number, dto: UpdateBookDto) {
        const { title, authorId, genreIds, publishedAt } = dto;

        //#Start transaction
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const bookInTx = await queryRunner.manager.findOne(Book, {
                where: { id },
                relations: ['author', 'genres'],
            });
            if (!bookInTx) {
                throw new NotFoundException(`Book with id ${id} not found`);
            }

            // #Updating

            if (title) bookInTx.title = title;

            if (publishedAt) {
                bookInTx.publishedAt = new Date(publishedAt);
            }

            if (authorId) {
                const author = await queryRunner.manager.findOne(
                    Author,
                    { where: { id: authorId } }
                );

                if (!author) {
                    throw new NotFoundException(`Author with id ${authorId} not found`);
                }

                bookInTx.author = author;
            }

            if (genreIds?.length) {
                const genres = await queryRunner.manager.findBy(Genre, {
                    id: In(genreIds),
                });
                this.validateGenreIdsOrThrow(genreIds, genres);

                bookInTx.genres = genres;
            }

            const saved = await queryRunner.manager.save(bookInTx);
            await queryRunner.commitTransaction();
            return saved;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    /**
    * Validates that all the provided genre IDs exist in the found genres.
    *
    * @param genreIds - An array of genre IDs to validate.
    * @param foundGenres - An array of Genre entities that were found in the database.
    *
    * @throws NotFoundException if any of the provided genre IDs do not exist in the found genres.
    */
    private validateGenreIdsOrThrow(genreIds: number[], foundGenres: Genre[]) {
        const foundIds = foundGenres.map(g => g.id);
        const missingIds = (genreIds || []).filter(id => !foundIds.includes(id));

        if (missingIds.length > 0) {
            throw new NotFoundException(`The following genre IDs do not exist: ${missingIds.join(', ')}`);
        }
    }

    async delete(id: number) {
        const result = await this.bookRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Book with id ${id} not found`);
        }
    }
}
