import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsersTable1750251642495 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'username',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                        isUnique: true
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                        isUnique: true
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        length: '60', //cuz the result of bcrypt.hash is 60
                        isNullable: false,
                    },
                    {
                        name: 'role',
                        type: 'varchar',
                        length: '20',
                        default: 'user',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }

}
