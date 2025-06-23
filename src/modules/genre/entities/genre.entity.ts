import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany } from 'typeorm';
import { Book } from '../../book/entities/book.entity';

@Entity('genres')
export class Genre {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Unique(['name'])
    name: string;

    @ManyToMany(() => Book, (book) => book.genres)
    books: Book[];
}
