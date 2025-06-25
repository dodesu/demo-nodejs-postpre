import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    Unique,
} from 'typeorm';
import { Book } from '../../book/entities/book.entity';

@Entity('authors')
@Unique(['name'])
export class Author {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })

    name: string;

    // One author has many books
    @OneToMany(() => Book, (book) => book.author)
    books: Book[];
}