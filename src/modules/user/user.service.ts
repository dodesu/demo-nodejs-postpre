import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { BookResponseDto } from '../book/dto/book-response.dto';
import { Book } from '../book/entities/book.entity';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Book)
        private bookRepository: Repository<Book>,
    ) { }

    async getAll() {
        const users = await this.userRepository.find();

        return users.map((user) => new UserResponseDto(user));
    }

    async getById(id: number) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found.`);
        }

        return new UserResponseDto(user);
    }

    getByEmail(email: string) {
        return this.userRepository.findOne({ where: { email } });
    }

    getByUsername(username: string) {
        return this.userRepository.findOne({ where: { username } });
    }

    async create(dto: CreateUserDto) {
        const { username, email, password } = dto;

        const whereConditions: any[] = [
            { username: username },
        ];
        // cuz email is optional
        if (email) {
            whereConditions.push({ email: email });
        }

        const existingUser = await this.userRepository.findOne({
            where: whereConditions
        });

        if (existingUser) {
            if (existingUser.username === username) {
                throw new ConflictException('Username already exists');
            }
            if (existingUser.email === email) {
                throw new ConflictException('Email already exists');
            }
        }

        // note: add role for user later
        this.userRepository.create({
            username,
            email,
            password
        });

        const saved = await this.userRepository.save(dto);

        return new UserResponseDto(saved);
    }

    async update(id: number, dto: UpdateUserDto) {
        const { username, email, password } = dto;

        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found.`);
        }

        // #Validate username and email, if valid, update

        let usernameExists, emailExists;
        if (username) {
            usernameExists = await this.userRepository.findOne({
                where: { username, id: Not(user.id) }
            });

            if (usernameExists) {
                throw new ConflictException('Username already exists');
            }
            user.username = username;
        }

        if (email) {
            emailExists = await this.userRepository.findOne({
                where: { email, id: Not(user.id) }
            });

            if (emailExists) {
                throw new ConflictException('Email already exists');
            }
            user.email = email;
        }



        if (password) {
            //note: temp placed; if not through auth -- not hash yet, will hash it.
            // '$2a$10' is prefix of hash string
            user.password = password.slice(0, 6) === '$2a$10' ? password : await bcrypt.hash(password, 10);
        }

        const updated = await this.userRepository.save(user);

        return new UserResponseDto(updated);
    }

    async delete(id: number) {
        const result = await this.userRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
    }

    async getReadBooks(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations:
                ['readBooks',
                    'readBooks.author',
                    'readBooks.genres',
                    'readBooks.creator',]
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user.readBooks.map((b) => new BookResponseDto(b));
    }

    async addReadBooks(bookId, user) {
        const book = await this.bookRepository.findOne({
            where: { id: bookId },
            relations: ['author', 'genres', 'creator'],
        });
        if (!book) {
            throw new NotFoundException(`Book with id:${bookId} not found`);
        }

        const currentUser = await this.userRepository.findOne({
            where: { id: user.id },
            relations: ['readBooks'],
        }); //No need to check userId exists, cuz use auth guard
        const isReadBook = currentUser?.readBooks.some((b) => b.id === bookId);

        if (isReadBook) {
            throw new ConflictException('Book already marked as read');
        }
        //mark book as read
        await this.userRepository
            .createQueryBuilder()
            .relation('readBooks')
            .of(user.id)
            .add(bookId);

        return new BookResponseDto(book);
    }

    async removeBookFromReadList(bookId, user) {
        const book = await this.bookRepository.findOneById(bookId);
        if (!book) {
            throw new NotFoundException(`Book with id:${bookId} not found`);
        }

        return this.userRepository
            .createQueryBuilder()
            .relation('readBooks')
            .of(user.id)
            .remove(bookId);
    }
}
