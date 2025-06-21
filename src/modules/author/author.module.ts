import { Module } from '@nestjs/common';
import { AuthorController } from './author.controller';

@Module({
  controllers: [AuthorController]
})
export class AuthorModule {}
