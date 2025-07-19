import { Expose, Transform } from 'class-transformer';
import { User } from '../entities/user.entity';

export class UserResponseDto {
    @Expose()
    id: number;

    @Expose()
    username: string;

    @Expose()
    @Transform(({ value }) => (value === undefined ? undefined : value), {
        toPlainOnly: true,
    })
    email?: string;

    constructor(user: User) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
    }
}