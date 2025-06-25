import { Controller, Get, Post, Body, Render, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @Render('home')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    check(@Req() req: Request) {
        return req.user;
    }
}
