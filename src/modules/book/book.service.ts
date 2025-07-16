import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DataSource, ILike } from 'typeorm';
import { Book } from './entities/book.entity';
import { Author } from '../author/entities/author.entity';
import { Genre } from '../genre/entities/genre.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { SearchBookDto } from './dto/search-book.dto';
import { BookResponseDto } from './dto/book-response.dto';
import { SelectQueryBuilder } from 'typeorm';

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

    async getAll(user?) {
        const books = await this.bookRepository.find({
            relations: ['author', 'genres', 'creator', 'readers'],
            order: {
                id: 'ASC', //may should be created_at
            },
        });

        if (user) {
            return books.map((b) => new BookResponseDto(b, user.id));
        }

        return books.map((b) => new BookResponseDto(b));
    }

    async getById(id: number, user) {
        const book = await this.bookRepository.findOne({
            where: { id },
            relations: ['author', 'genres', 'creator'],
            order: {
                id: 'ASC'
            }
        });

        if (!book) {
            throw new NotFoundException(`Book with id ${id} not found`);
        }

        if (user) {
            return new BookResponseDto(book, user.id);
        }
        return new BookResponseDto(book);
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
    async create(dto: CreateBookDto, user) {
        // note: think about validate a user if others use this service
        const { title, authorId, genreIds, publishedAt, isRead } = dto;

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
            publishedAt: publishedAt ? new Date(publishedAt) : undefined,
            creator: user,
            readers: isRead ? [user] : [],
        });

        const bookSaved = await this.bookRepository.save(book);

        return new BookResponseDto(bookSaved, user.id);
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
    async update(id: number, dto: UpdateBookDto, user) {
        const { title, authorId, genreIds, publishedAt } = dto;

        //#Start transaction
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const bookInTx = await queryRunner.manager.findOne(Book, {
                where: { id },
                relations: ['author', 'genres', 'creator'],
            });

            if (!bookInTx) {
                throw new NotFoundException(`Book with id ${id} not found`);
            }

            if (bookInTx.creator.id !== user.id) {
                throw new ForbiddenException(`You are not allowed to update this book`);
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

            return new BookResponseDto(saved);
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

    async delete(id: number, user) {
        const isAllowed = await this.isCreatorOfBook(id, user.id);
        if (!isAllowed) {
            throw new ForbiddenException(`You are not allowed to delete this book`);
        }

        const result = await this.bookRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Book with id ${id} not found`);
            //this probably never happened, should be above isCreatorOfBook
            // but placed it here temporarily
        }
    }

    /**
     * Checks if the user is the creator of the book with the given ID.
     * If userId or bookId not exist always return false
     */
    private async isCreatorOfBook(bookId: number, userId: number) {
        const book = await this.bookRepository.findOne({
            where: { id: bookId },
            relations: ['creator'],
        });
        if (book?.creator.id === userId) {
            return true;
        }

        return false;
    }


    /**
     * Searches for books by keyword in their title, author's name, or genres' names.
     *
     * @param dto - Data transfer object containing search criteria including:
     *   - keyword: The search keyword.
     *
     * @returns An array of book entities matching the search criteria.
     */
    async search(dto: SearchBookDto) {
        const { keyword, page, limit } = dto;

        // # Subquery

        const authorMatch = this.bookRepository
            .createQueryBuilder('book')
            .leftJoin('book.author', 'author')
            .select('book.id')
            .where('author.name ILIKE :keyword');

        const genreMatch = this.bookRepository
            .createQueryBuilder('book')
            .leftJoin('book.genres', 'genre')
            .select('book.id')
            .where('genre.name ILIKE :keyword');

        const titleMatch = this.bookRepository
            .createQueryBuilder('book')
            .select('book.id')
            .where('book.title ILIKE :keyword');

        const creatorMatch = this.bookRepository
            .createQueryBuilder('book')
            .leftJoin('book.creator', 'creator')
            .select('book.id')
            .where('creator.username ILIKE :keyword');

        // # Main query

        const bookQuery = await this.bookRepository
            .createQueryBuilder("book")
            .leftJoinAndSelect("book.author", "author")
            .leftJoinAndSelect("book.genres", "genre")
            .leftJoinAndSelect("book.creator", "creator")
            .where(`book.id IN (${titleMatch.getQuery()})`)
            .orWhere(`book.id  IN (${authorMatch.getQuery()})`)
            .orWhere(`book.id IN (${genreMatch.getQuery()})`)
            .orWhere(`book.id IN (${creatorMatch.getQuery()})`)
            .setParameters({ keyword: `%${keyword}%` });

        const [data, total, totalPages] = await this.getPaginatedBooks(bookQuery, page, limit);

        return {
            data: data.map((item) => new BookResponseDto(item)),
            meta: {
                total,
                page,
                limit,
                totalPages
            }
        }
    }

    /**
     * Searches for books with advanced filtering, sorting, and pagination options.
     *
     * @param dto - Data transfer object containing search criteria including:
     *   - title: Optional partial or full title to search for.
     *   - authorId: Optional ID of the author to filter books by.
     *   - genreIds: Optional array of genre IDs to filter books by.
     *   - publishedFrom: Optional start date to filter books published after this date.
     *   - publishedTo: Optional end date to filter books published before this date.
     *   - sort: Optional sorting order ('title_asc', 'title_desc', 'published_asc', 'published_desc').
     *   - page: Optional page number for pagination (default is 1).
     *   - limit: Optional number of items per page for pagination (default is 10).
     *
     * @returns An object containing an array of book entities matching the search criteria,
     *          and metadata including total count, current page, limit, and total pages.
     */
    async searchAdvanced(dto: SearchBookDto) {
        const {
            title,
            authorId,
            genreIds,
            creatorName,
            publishedFrom,
            publishedTo,
            sort = 'title_asc',
            page = 1,
            limit = 10
        } = dto;

        const whereClauses = {
            title: `book.title ILIKE :title`,
            author: `author.id = :authorId`,
            creator: `creator.username ILIKE :name`,
            genres: `genres.id IN (:...genreIds)`,
            published: `book.publishedAt BETWEEN :from AND :to`
        };

        const bookQuery = this.bookRepository.createQueryBuilder('book')
            .leftJoinAndSelect('book.author', 'author')
            .leftJoinAndSelect('book.genres', 'genres')
            .leftJoinAndSelect('book.creator', 'creator')
            .where('1 = 1');
        // Add a dummy WHERE clause to allow chaining .andWhere() without checking if it's the first condition

        // #Searching..

        if (title) {
            bookQuery.andWhere(whereClauses.title, { title: `%${title}%` });
        }

        if (authorId) {
            bookQuery.andWhere(whereClauses.author, { authorId });
        }

        if (creatorName) {
            bookQuery.andWhere(whereClauses.creator, { name: `%${creatorName}%` });
        }

        if (genreIds?.length) {
            // Apply a subquery to filter by genre IDs, ensuring complete book data is retained even if some genres don't match.
            const subQuery = this.bookRepository.createQueryBuilder('book')
                .select('book.id')
                .leftJoin('book.genres', 'genres')
                .where(whereClauses.genres, { genreIds });

            // Chain the subquery to the main query 
            bookQuery.andWhere(`book.id IN (${subQuery.getQuery()})`)
                .setParameters(subQuery.getParameters());
        }

        if (publishedFrom && publishedTo) {
            bookQuery.andWhere(whereClauses.published, {
                from: publishedFrom,
                to: publishedTo,
            });
        }

        // #Sort
        const [sortField, sortDir] = sort.split('_');
        const sortMap = {
            title: 'book.title',
            published: 'book.publishedAt',
        };

        const field = sortMap[sortField] || 'book.title';
        const direction = sortDir?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        bookQuery.orderBy(field, direction as 'ASC' | 'DESC');
        // TS considers the sortDir as a string, so we need to cast it to 'ASC' | 'DESC' to avoid errors

        // #Pagination
        const [data, total, totalPages] = await this.getPaginatedBooks(bookQuery, page, limit);

        return {
            data: data.map((item) => new BookResponseDto(item)),
            meta: {
                total,
                page,
                limit,
                totalPages
            }
        }
    }

    /**
     * Get paginated books
     * @param bookQuery The query builder object for book
     * @param page The page number
     * @param limit The number of items per page
     * @returns An array of paginated data, total items, and total pages
     */
    private async getPaginatedBooks(bookQuery: SelectQueryBuilder<Book>, page, limit)
        : Promise<[Book[], number, number]> {

        const skip = (page - 1) * limit;
        const [data, total] = await bookQuery
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        const totalPages = Math.ceil(total / limit);
        return [data, total, totalPages];
    }

}
