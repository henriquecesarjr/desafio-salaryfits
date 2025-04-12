import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  getAllBooks(@Query() dto: PaginationDto) {
    return this.bookService.getAllBooks(dto);
  }

  @Get(":id")
  getBookById(@Param("id") id: string) {
    return this.bookService.getBookById(id);
  }

  @Post()
  createBook(@Body() dto: CreateBookDto) {
    return this.bookService.createBook(dto);
  }

  @Patch(":id")
  updateBook(@Param("id") id: string, @Body() dto: UpdateBookDto) {
    return this.bookService.updateBook(id, dto)
  }

  @Delete(":id")
  deleteBook(@Param("id") id: string) {
    return this.bookService.deleteBook(id);
  }
}
