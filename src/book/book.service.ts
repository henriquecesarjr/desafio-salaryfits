import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import { UpdateReviewDto } from 'src/review/dto/update-review.dto';
import { ResponseBookDto } from './dto/response-book.dto';
import { ResponseReviewDto } from 'src/review/dto/review-response.dto';
import { ResponseAllReviews } from 'src/review/dto/all-reviews-response.dto';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  async getAllBooks(dto?: PaginationDto): Promise<ResponseBookDto[]> {
    const { limit = 10, offset = 0 } = dto || {};

    const allBooks = await this.prisma.book.findMany({
      take: limit,
      skip: offset
    });

    return allBooks;
  }

  async getBookById(id: string): Promise<ResponseBookDto>  {
    const findBook = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!findBook) {
      throw new HttpException("O livro não foi encontrado!", HttpStatus.NOT_FOUND);
    }

    return findBook;
  }

  async createBook(dto: CreateBookDto): Promise<ResponseBookDto> {
    const existingBook = await this.prisma.book.findFirst({
      where: {
        title: dto.title,
      }
    })
  
    if (existingBook) {
      throw new HttpException("Já existe um livro com esse título e autor.", HttpStatus.CONFLICT);
    }
  
    const newBook = await this.prisma.book.create({
      data: {
        title: dto.title,
        author: dto.author,
        description: dto.description,
        year: dto.year,
      },
    });
  
    return newBook;
  }

  async updateBook(id: string, dto: UpdateBookDto): Promise<ResponseBookDto> {
    try {
      const findBook = await this.prisma.book.findFirst({
        where: { id },
      });
  
      if (!findBook) {
        throw new HttpException("O livro não foi encontrado!", HttpStatus.NOT_FOUND);
      }
  
      const updatedBook = await this.prisma.book.update({
        where: {
          id: findBook.id,
        },
        data: {
          title: dto?.title ? dto?.title : findBook.title,
          author: dto?.author ? dto?.author : findBook.author,
          description: dto.description ? dto?.description : findBook.description,
          year: dto?.year ? dto?.year : findBook.year
        }
      });
  
      return updatedBook;
    } catch (error) {
      throw new HttpException(
        error?.message || "Erro ao atualizar o livro.",
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteBook (id: string) {
    try {
      const findBook = await this.prisma.book.findFirst({
        where: { id },
      });
  
      if (!findBook) {
        throw new HttpException("O livro não foi encontrado!", HttpStatus.NOT_FOUND);
      }
  
      await this.prisma.book.delete({
        where: {
          id: findBook.id,
        },
      });
  
      return {
        message: "Livro deletado com sucesso!",
      };
    } catch (error) {
      throw new HttpException(
        error?.message || "Erro ao deletar o livro.",
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createReview(bookId: string, createReviewdto: CreateReviewDto, tokenPayloadDto: PayloadTokenDto): Promise<ResponseReviewDto> {
    const bookExists = await this.prisma.book.findUnique({
      where: { id: bookId }
    });

    if (!bookExists) {
      throw new NotFoundException('Livro não encontrado');
    }

    const existingReview = await this.prisma.review.findFirst({
      where: {
        bookId,
        userId: tokenPayloadDto.sub
      }
    });

    if (existingReview) {
      throw new ConflictException('Você já avaliou este livro');
    }

    const createdReview = this.prisma.review.create({
      data: {
        bookId,
        userId: tokenPayloadDto.sub,
        rating: createReviewdto.rating,
        comment: createReviewdto.comment
      }
    })

    return createdReview;
  }

  async getBookReviews(bookId: string, dto: PaginationDto): Promise<ResponseAllReviews[]> {
    const { limit = 10, offset = 0 } = dto || {};

    const bookExists = await this.prisma.book.findUnique({
      where: { id: bookId }
    });

    if (!bookExists) {
      throw new NotFoundException('Livro não encontrado');
    }

    const reviews = await this.prisma.review.findMany({
      where: { bookId: bookExists.id },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  
    return reviews;
  }

  async updateReview(id: string, updateReviewdto: UpdateReviewDto, tokenPayloadDto: PayloadTokenDto): Promise<ResponseReviewDto> {
    try {
      const reviewsExists = await this.prisma.review.findUnique({
        where: {
          id,
          userId: tokenPayloadDto.sub,
        }
      })
  
      if(!reviewsExists) {
        throw new HttpException("Review não encontrada", HttpStatus.NOT_FOUND);
      }

      if(reviewsExists.userId !== tokenPayloadDto.sub) {
        throw new HttpException("Não é possível atualizar essa avaliação", HttpStatus.UNAUTHORIZED);
      }

      const updatedReview = await this.prisma.review.update({
        where: {
          id: reviewsExists.id
        },
        data: {
          rating: updateReviewdto?.rating ? updateReviewdto?.rating : reviewsExists.rating,
          comment: updateReviewdto?.comment ? updateReviewdto?.comment : reviewsExists.comment
        }
      })
      
      return updatedReview;

    }catch(err) {
      throw new HttpException("Erro ao atualizar a avaliação", HttpStatus.BAD_REQUEST);
    }
  }
}
