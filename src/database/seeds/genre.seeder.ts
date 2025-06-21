import { Connection } from 'typeorm';
import { Genre } from '../../modules/genre/entities/genre.entity';

export async function GenreSeeder(connection: Connection) {
    const repository = connection.getRepository(Genre);

    try {
        const dataSeeds = [
            { name: 'Fantasy' },
            { name: 'Science Fiction' },
            { name: 'Mystery' },
            { name: 'Romance' },
            { name: 'Horror' },
            { name: 'Thriller' },
            { name: 'History' },
            { name: 'Adventure' },
            { name: 'Biography' },
            { name: 'Self Help' },
            { name: 'Cooking' },
            { name: 'Travel' },
            { name: 'Health' },
            { name: 'Business' },
            { name: 'Politics' },
            { name: 'Science' },
        ];

        for (const data of dataSeeds) {
            const existing = await repository.findOne({ where: { name: data.name } });
            if (!existing) {
                const genre = repository.create(data);
                await repository.save(genre);
            }
        }

        console.log('\x1b[32m%s\x1b[0m', 'GenreSeeder done!');
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', 'GenreSeeder failed!');
    }
}
