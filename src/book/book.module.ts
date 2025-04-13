import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ApiExceptionFilter } from 'src/common/filters/exception-filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [PrismaModule],
  controllers: [BookController],
  providers: [
    BookService,
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter
    },
    {
      provide: "KEY_TOKEN",
      useValue: "TOKEN_123456789"
    }
  ]
})
export class BookModule {}
