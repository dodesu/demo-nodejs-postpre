import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Connection } from 'typeorm';
//seeders
import { UserSeeder } from './user.seeder';
import { AuthorSeeder } from './author.seeder';
import { GenreSeeder } from './genre.seeder';
import { BookSeeder } from './book.seeder';
import { ReadBooksSeeder } from './read-books.seeder';
import { BookGenresSeeder } from './book-genres.seeder';


interface SeederFunction {
    (connection: Connection): Promise<void>;
}

async function runSeeders() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const connection = app.get(Connection);

    console.log('Starting seeder...');
    const seeders: SeederFunction[] = [
        UserSeeder,
        AuthorSeeder,
        GenreSeeder,
        BookSeeder,
        ReadBooksSeeder,
        BookGenresSeeder,
    ];

    try {
        for (const seeder of seeders) {
            await seeder(connection);
        }
    } finally {
        await app.close();
    }

}

runSeeders();