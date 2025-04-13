import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { LoggerInterceptor } from 'src/common/interceptors/logger.interceptor';
import { BodyCreateBookInterceptor } from 'src/common/interceptors/body-create-book.interceptor';
import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.interceptor';
import { AuthAdminGuard } from 'src/common/guards/admin.guard';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import { TokenPayloadParam } from 'src/auth/param/token-payload-param';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import { UpdateReviewDto } from 'src/review/dto/update-review.dto';

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

  @UseGuards(AuthTokenGuard)
  @Post(":id/reviews")
  createReview(
    @Param('id') bookId: string,
    @Body() createReviewdto: CreateReviewDto,
    @TokenPayloadParam() tokenPayloadDto: PayloadTokenDto
  ) 
  {
    return this.bookService.createReview(bookId, createReviewdto, tokenPayloadDto);
  }

  @UseGuards(AuthTokenGuard)
  @Patch("reviews/:id")
  updateReview(
    @Param('id') id: string,
    @Body() updateReviewdto: UpdateReviewDto,
    @TokenPayloadParam() tokenPayloadDto: PayloadTokenDto
  )
  {
    return this.bookService.updateReview(id, updateReviewdto, tokenPayloadDto);
  }

  @Get(":id/reviews")
  getAllReviews(@Param('id') bookId: string) {
    return this.bookService.getBookReviews(bookId);
  }
}
