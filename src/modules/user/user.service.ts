import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    getAll() {
        return this.userRepository.find();
    }

    getById(id: number) {
        return this.userRepository.findOne({ where: { id } });
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

        return this.userRepository.save(dto);
    }

    async update(id: number, dto: UpdateUserDto) {
        const { username, email, password } = dto;

        const user = await this.getById(id);

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

        return this.userRepository.save(user);
    }

    async delete(id: number) {
        const result = await this.userRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
    }
}
