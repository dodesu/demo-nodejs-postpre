import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    ManyToMany,
    JoinColumn,
} from 'typeorm';
//Relations
import { Author } from '../../author/entities/author.entity';
import { User } from '../../user/entities/user.entity';

@Entity('books')
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    // Many books belong to one author
    @ManyToOne(() => Author, (author) => author.books)
    @JoinColumn({ name: 'author_id' })
    author: Author; //use: <instance of Book>.author

    @Column({ type: 'date', nullable: true, name: 'published_at' })
    publishedAt: Date;

    @ManyToMany(() => User, (user) => user.readBooks)
    readers: User[];

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;
}