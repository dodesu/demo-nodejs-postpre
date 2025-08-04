import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    OneToMany,
    JoinTable,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Book } from '../../book/entities/book.entity';
import { Role } from '../constants/role.enum';

@Entity('users')
@Unique(['username'])
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', unique: true, length: 50 })
    username: string;

    @Column({ type: 'varchar', unique: true, length: 255 })
    email?: string;

    @Column({ type: 'varchar', length: 60 })
    password: string;

    @Column({ type: 'varchar', length: 20, default: Role.USER })
    role: Role;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    //#region Relations:

    @ManyToMany(() => Book, (book) => book.readers)
    @JoinTable({
        name: 'read_books',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'book_id',
            referencedColumnName: 'id',
        },
    })
    readBooks: Book[];

    @OneToMany(() => Book, (book) => book.creator)
    books: Book[];

    //#endregion

}
