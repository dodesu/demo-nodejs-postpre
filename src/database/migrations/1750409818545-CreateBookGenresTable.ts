import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBookGenresTable implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'book_genres',
                columns: [
                    {
                        name: 'book_id',
                        type: 'int',
                        isPrimary: true,
                    },
                    {
                        name: 'genre_id',
                        type: 'int',
                        isPrimary: true,
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ['book_id'],
                        referencedTableName: 'books',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE',
                    },
                    {
                        columnNames: ['genre_id'],
                        referencedTableName: 'genres',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE',
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('book_genres');
    }
}
