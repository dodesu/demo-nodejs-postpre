import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';

@Module({
  controllers: [GenreController]
})
export class GenreModule {}
