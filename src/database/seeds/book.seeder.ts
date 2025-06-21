import { Connection } from 'typeorm';
import { Book } from '../../modules/book/entities/book.entity';

export async function BookSeeder(connection: Connection) {
    const repository = connection.getRepository(Book);

    try {
        const dataSeeds = [
            {
                title: 'Harry Potter and the Philosopher\'s Stone',
                author: { id: 1 },
                publishedAt: new Date('1997-06-26'),
            },
            {
                title: 'A Game of Thrones',
                author: { id: 2 },
                publishedAt: new Date('1996-08-06'),
            },
            {
                title: 'The Lord of the Rings',
                author: { id: 3 },
                publishedAt: new Date('1954-07-29'),
            },
            {
                title: 'Murder on the Orient Express',
                author: { id: 4 },
                publishedAt: new Date('1934-01-01'),
            },
            {
                title: 'The Shining',
                author: { id: 1 },
                publishedAt: new Date('1977-01-28'),
            },
            {
                title: 'IT',
                author: { id: 1 },
                publishedAt: new Date('1986-09-15'),
            },
            {
                title: 'The Hitchhiker\'s Guide to the Galaxy',
                author: { id: 3 },
                publishedAt: new Date('1979-06-24'),
            },
            {
                title: 'The Lord of the Rings: The Fellowship of the Ring',
                author: { id: 3 },
                publishedAt: new Date('1954-07-29'),
            },
            {
                title: 'The Lord of the Rings: The Two Towers',
                author: { id: 3 },
                publishedAt: new Date('1954-07-29'),
            },
            {
                title: 'The Lord of the Rings: The Return of the King',
                author: { id: 3 },
                publishedAt: new Date('1954-07-29'),
            },
        ];

        for (const data of dataSeeds) {
            const existing = await repository.findOne({ where: { title: data.title } });
            if (!existing) {
                const book = repository.create(data);
                await repository.save(book);
            }
        }

        console.log('\x1b[32m%s\x1b[0m', 'BookSeeder done!');
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', 'BookSeeder failed!', error);
    }
}
