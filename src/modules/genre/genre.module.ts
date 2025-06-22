import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { GenreService } from './genre.service';

@Module({
  imports: [TypeOrmModule.forFeature([Genre])],
  controllers: [GenreController],
  exports: [TypeOrmModule],
  providers: [GenreService],
})
export class GenreModule { }
