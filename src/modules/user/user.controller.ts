import {
    Controller,
    Param, Body,
    Get, Post, Patch, Delete,
    HttpCode
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
}
