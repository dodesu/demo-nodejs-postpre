import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateBooksTable1750254737745 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'books',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'author_id',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'creator_id',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'published_at',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                        isNullable: false,
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ['author_id'],
                        referencedTableName: 'authors',
                        referencedColumnNames: ['id'],
                        onDelete: 'SET NULL',
                    },
                    {
                        columnNames: ['creator_id'],
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE',
                    }

                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('books');
    }
}
