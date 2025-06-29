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
import { Exclude } from 'class-transformer';

import { Book } from '../../book/entities/book.entity';

@Entity('users')
@Unique(['username'])
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 50 })
    username: string;

    @Column({ unique: true, length: 255 })
    email?: string;

    @Exclude()
    @Column({ length: 60 })
    password: string;

    @Exclude()
    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @Exclude()
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
