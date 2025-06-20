import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateBooksTable implements MigrationInterface {

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
                        name: 'author',
                        type: 'varchar',
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
                    },
                    {
                        name: 'isRead',
                        type: 'boolean',
                        default: false,
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ['author_id'],
                        referencedTableName: 'authors',
                        referencedColumnNames: ['id'],
                        onDelete: 'SET NULL',
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('books');
    }

}
