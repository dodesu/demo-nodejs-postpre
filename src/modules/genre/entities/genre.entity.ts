import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany } from 'typeorm';
import { Book } from '../../book/entities/book.entity';

@Entity('genres')
@Unique(['name'])
export class Genre {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => Book, (book) => book.genres)
    books: Book[];
}
