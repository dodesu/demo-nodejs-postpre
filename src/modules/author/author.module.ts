import { Module } from '@nestjs/common';
import { AuthorController } from './author.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { AuthorService } from './author.service';

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [TypeOrmModule],
})
export class AuthorModule { }
