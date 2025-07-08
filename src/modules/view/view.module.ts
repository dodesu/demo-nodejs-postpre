import { Module } from '@nestjs/common';
import { ViewController } from './view.controller';
import { ViewService } from './view.service';
import { BookModule } from '../book/book.module';

@Module({
  imports: [BookModule],
  controllers: [ViewController],
  providers: [ViewService]
})
export class ViewModule { }
