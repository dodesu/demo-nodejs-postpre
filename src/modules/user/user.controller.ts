import {
    Controller,
    Param, Body,
    Get, Post, Patch, Delete,
    HttpCode,
    UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    getAll() {
        return this.userService.getAll();
    }

    @Get(':id')
    getById(@Param('id') id: number) {
        return this.userService.getByIdOrThrow(id);
    }

    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
        return this.userService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(204)
    delete(@Param('id') id: number) {
        return this.userService.delete(id);
    }

    // @UseGuards(AuthGuard('jwt'))
    @Get('/:id/read-books')
    getUserBooks(@Param('id') userId: number) {
        return this.userService.getReadBooks(userId);
    }

    @Post('/:id/read-books')
    @UseGuards(AuthGuard('jwt'))
    addReadBooks(@Body('bookId') bookId: any, @CurrentUser() user) {
        return this.userService.addReadBooks(bookId, user);
    }

}
