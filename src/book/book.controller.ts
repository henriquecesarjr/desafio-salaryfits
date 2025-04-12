import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

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
