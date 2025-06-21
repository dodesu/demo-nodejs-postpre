import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    ManyToMany,
    JoinColumn,
    JoinTable,
} from 'typeorm';
//Relations
import { Author } from '../../author/entities/author.entity';
import { User } from '../../user/entities/user.entity';
import { Genre } from '../../genre/entities/genre.entity';

@Entity('books')
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'date', nullable: true, name: 'published_at' })
    publishedAt: Date;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    //#region Relations:

    @ManyToOne(() => Author, (author) => author.books)
    @JoinColumn({ name: 'author_id' })
    author: Author; //use: <instance of Book>.author

    @ManyToMany(() => Genre, (genre) => genre.books)
    @JoinTable({
        name: 'book_genres',
        joinColumn: {
            name: 'book_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'genre_id',
            referencedColumnName: 'id',
        },
    })
    genres: Genre[];

    //#endregion

    @ManyToMany(() => User, (user) => user.readBooks)
    readers: User[];
}