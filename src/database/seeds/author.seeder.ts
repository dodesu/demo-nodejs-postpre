import { Connection } from 'typeorm';
import { Author } from '../../modules/author/entities/author.entity';

export async function AuthorSeeder(connection: Connection) {
    const repository = connection.getRepository(Author);

    try {
        const dataSeeds = [
            { name: 'J.K. Rowling' },
            { name: 'George R.R. Martin' },
            { name: 'J.R.R. Tolkien' },
            { name: 'Agatha Christie' },
            { name: 'Stephen King' },
            { name: 'Isaac Asimov' },
            { name: 'Jane Austen' },
            { name: 'Ernest Hemingway' },
            { name: 'Mark Twain' },
            { name: 'F. Scott Fitzgerald' },
            { name: 'J. K. Rowling' },
            { name: 'H. P. Lovecraft' },
        ];

        for (const data of dataSeeds) {
            const existing = await repository.findOne({ where: { name: data.name } });
            if (!existing) {
                const author = repository.create(data);
                await repository.save(author);
            }
        }

        console.log('\x1b[32m%s\x1b[0m', 'AuthorSeeder done!');
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', 'AuthorSeeder failed!');
    }
}
