import {
    Injectable,
    UnauthorizedException,
    BadRequestException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async register(dto: RegisterDto) {
        const { username, email, password, confirmPassword } = dto;
        const passHashed = await bcrypt.hash(password, 10);

        if (confirmPassword !== password) {
            throw new BadRequestException('Passwords do not match.');
        }

        const createUserDto: CreateUserDto = {
            username, email, password: passHashed
        };

        return this.usersService.create(createUserDto);
    }

    async login(dto: LoginDto) {
        const { usernameOrEmail, password } = dto;

        let user;
        if (usernameOrEmail.includes('@')) {
            user = await this.usersService.getByEmail(usernameOrEmail);
        } else {
            user = await this.usersService.getByUsername(usernameOrEmail);
        }

        if (!user) throw new UnauthorizedException('Username or email is incorrect.');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Wrong password');

        return {
            access_token: this.jwtService.sign(user)
            // note: this can make multiple tokens. issues in future
        };
    }
}
