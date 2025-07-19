import { Module } from '@nestjs/common';
import { ViewController } from './view.controller';
import { ViewService } from './view.service';
import { BookModule } from '../book/book.module';
import { GenreModule } from '../genre/genre.module';
import { AuthorModule } from '../author/author.module';

@Module({
  imports: [BookModule, GenreModule, AuthorModule],
  controllers: [ViewController],
  providers: [ViewService]
})
export class ViewModule { }
