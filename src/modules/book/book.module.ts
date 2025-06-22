import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { AuthorModule } from '../author/author.module';
import { GenreModule } from '../genre/genre.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    AuthorModule,
    GenreModule,
  ],
  controllers: [BookController],
  providers: [BookService],
  exports: [],
})
export class BookModule { }
