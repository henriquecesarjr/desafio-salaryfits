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
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

  @ApiOperation({
    summary: "Search all registered books",
    description: "Retrieves complete information for all books"
  })
  @ApiQuery({
    name: "limit",
    required: false
  })
  @ApiQuery({
    name: "offset",
    required: false
  })
  @Get()
  getAllBooks(@Query() dto: PaginationDto) {
    return this.bookService.getAllBooks(dto);
  }

  @ApiOperation({ 
    summary: "Get book details by ID",
    description: "Retrieves complete information for a specific book"
  })
  @Get(":id")
  getBookById(@Param("id") id: string) {
    return this.bookService.getBookById(id);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: "Create a new book",
    description: "Adds a new book to the collection (requires authentication)"
  })
  @Post()
  createBook(@Body() dto: CreateBookDto) {
    return this.bookService.createBook(dto);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: "Update book information",
    description: "Modifies details of an existing book (requires authentication)"
  })
  @Patch(":id")
  updateBook(@Param("id") id: string, @Body() dto: UpdateBookDto) {
    return this.bookService.updateBook(id, dto)
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: "Delete a book",
    description: "Permanently removes a book from the collection (requires authentication)" 
  })
  @Delete(":id")
  deleteBook(@Param("id") id: string) {
    return this.bookService.deleteBook(id);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: "Add book review",
    description: "Submits a new review (rating 1-5) for the specified book (requires authentication)"
  })
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
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: "Update book review",
    description: "Modifies an existing book review (requires authentication and ownership)"
  })
  @Patch("reviews/:id")
  updateReview(
    @Param('id') id: string,
    @Body() updateReviewdto: UpdateReviewDto,
    @TokenPayloadParam() tokenPayloadDto: PayloadTokenDto
  )
  {
    return this.bookService.updateReview(id, updateReviewdto, tokenPayloadDto);
  }

  @ApiOperation({ 
    summary: "Get book reviews",
    description: "Retrieves all reviews for the specified book" 
  })
  @ApiQuery({
    name: "limit",
    required: false
  })
  @ApiQuery({
    name: "offset",
    required: false
  })
  @Get(":id/reviews")
  getAllReviews(@Param('id') bookId: string, @Query() dto: PaginationDto)
  {
    return this.bookService.getBookReviews(bookId, dto);
  }
}
