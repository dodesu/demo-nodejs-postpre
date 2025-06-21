import { Connection } from 'typeorm';
import { Book } from '../../modules/book/entities/book.entity';
import { Genre } from '../../modules/genre/entities/genre.entity';

function getRandomGenres(genres: Genre[], count: number): Genre[] {
    const shuffled = [...genres].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export async function BookGenresSeeder(connection: Connection) {
    const bookRepo = connection.getRepository(Book);
    const genreRepo = connection.getRepository(Genre);

    const totalGenresPerBook = 4;

    try {
        const books = await bookRepo.find({ relations: ['genres'] });
        const genres = await genreRepo.find();

        if (books.length === 0 || genres.length === 0) {
            console.warn('\x1b[33m%s\x1b[0m', 'No books or genres found. Skipping BookGenresSeeder.');
            return;
        }

        for (const book of books) {
            const randomGenres = getRandomGenres(genres, totalGenresPerBook);
            book.genres = [...(book.genres || []), ...randomGenres];
            await bookRepo.save(book);
        }

        console.log('\x1b[32m%s\x1b[0m', 'BookGenresSeeder done!');
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', 'BookGenresSeeder failed!', error);
    }
}
