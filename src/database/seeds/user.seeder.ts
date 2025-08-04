import { Connection } from 'typeorm';
import { User } from '../../modules/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/modules/user/constants/role.enum';

export async function UserSeeder(connection: Connection) {
    const repository = connection.getRepository(User);

    try {
        const dataSeeds = [
            { username: 'user1', email: 'user1@gmail.com', password: await bcrypt.hash('user1pass', 10), role: Role.ADMIN },

            { username: 'user2', email: 'user2@gmail.com', password: await bcrypt.hash('user2pass', 10), role: Role.USER },

            { username: 'user3', email: 'user3@gmail.com', password: await bcrypt.hash('user3pass', 10), role: Role.USER },
        ];

        for (const data of dataSeeds) {
            const existing = await repository.findOne({ where: { email: data.username } });
            if (!existing) {
                const user = repository.create(data);
                await repository.save(user);
            }
        }
        console.log('\x1b[32m%s\x1b[0m', 'UserSeeder done!');
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', 'UserSeeder failed!');
    }
}