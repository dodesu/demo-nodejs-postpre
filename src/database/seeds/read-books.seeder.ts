import { Connection } from 'typeorm';
import { User } from '../../modules/user/entities/user.entity';
import { Book } from '../../modules/book/entities/book.entity';

function getRandomBooks(books: Book[], count: number): Book[] {
    const shuffled = [...books].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export async function ReadBooksSeeder(connection: Connection) {
    const userRepo = connection.getRepository(User);
    const bookRepo = connection.getRepository(Book);

    const totalBooksRead = 5;

    try {
        const users = await userRepo.find({ relations: ['readBooks'] }); // Load users with relations
        const books = await bookRepo.find();

        if (users.length === 0 || books.length === 0) {
            console.warn('\x1b[33m%s\x1b[0m', 'No users or books found. Skipping ReadBooksSeeder.');
            return;
        }

        for (const user of users) {
            const randomBooks = getRandomBooks(books, totalBooksRead);
            user.readBooks = [...(user.readBooks || []), ...randomBooks];
            await userRepo.save(user);
        }

        console.log('\x1b[32m%s\x1b[0m', 'ReadBooksSeeder done!');
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', 'ReadBooksSeeder failed!', error);
    }
}
