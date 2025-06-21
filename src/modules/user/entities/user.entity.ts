import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable
} from 'typeorm';

import { Book } from '../../book/entities/book.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 50 })
    username: string;

    @Column({ unique: true, length: 255 })
    email?: string;

    @Column({ length: 60 })
    password: string;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'now()' })
    updatedAt: Date;

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

}
