import {
    Controller,
    Param, Body,
    Get, Post, Patch, Delete,
    HttpCode,
    UseGuards,
    ForbiddenException
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { SelfOrAdminGuard } from 'src/common/guards/self-or-admin.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from './constants/role.enum';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @UseGuards(OptionalJwtAuthGuard)
    @Get()
    getAll(@CurrentUser() user) {
        return this.userService.getAll(user);
    }

    @UseGuards(OptionalJwtAuthGuard)
    @Get(':id')
    getById(@Param('id') id: number, @CurrentUser() user) {
        return this.userService.getById(id, user);
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Post()
    create(@Body() dto: CreateUserDto, @CurrentUser() user) {
        return this.userService.create(dto, user);
    }

    @UseGuards(AuthGuard('jwt'), SelfOrAdminGuard)
    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: UpdateUserDto, @CurrentUser() user) {
        return this.userService.update(id, dto, user);
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Delete(':id')
    @HttpCode(204)
    delete(@Param('id') id: number) {
        return this.userService.delete(id);
    }

    @Get('/:id/read-books')
    getUserBooks(@Param('id') userId: number) {
        return this.userService.getReadBooks(userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/:id/read-books')
    addReadBooks(@Body('bookId') bookId: number, @Param('id') userId: number, @CurrentUser() user) {
        if (userId !== user.id) {
            throw new ForbiddenException(`You cannot add read books to another user`);
        }

        return this.userService.addReadBooks(bookId, user);
    }

    @Delete('/:id/read-books/:bookId')
    @HttpCode(204)
    @UseGuards(AuthGuard('jwt'))
    removeBookFromReadList(@Param('bookId') bookId: number, @Param('id') userId: number, @CurrentUser() user) {
        if (userId !== user.id) {
            throw new ForbiddenException(`You cannot remove read books from another user`);
        }

        return this.userService.removeBookFromReadList(bookId, user);
    }

}
