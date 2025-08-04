import { Expose } from 'class-transformer';
import { UserResponseDto } from './user-response.dto';
import { User } from '../entities/user.entity';

export class UserAdminViewDto extends UserResponseDto {

    @Expose()
    role: string

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    constructor(user: User) {
        super(user);
        Object.assign(this, user);
    }
}