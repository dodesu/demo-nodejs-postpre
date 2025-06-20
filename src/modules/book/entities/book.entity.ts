import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import { Author } from '../../author/entities/author.entity';

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

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @Column({ type: 'boolean', default: false, name: 'is_read' })
    isRead: boolean;
}