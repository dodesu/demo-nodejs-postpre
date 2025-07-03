import { Expose } from 'class-transformer';
import { User } from 'src/modules/user/entities/user.entity';

export class UserInBookDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    constructor(user: User) {
        this.id = user.id;
        this.name = user.username;
    }
}
