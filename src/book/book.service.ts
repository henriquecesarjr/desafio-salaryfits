import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  async getAllBooks(dto?: PaginationDto) {
    const { limit = 10, offset = 0 } = dto || {};

    const allBooks = await this.prisma.book.findMany({
      take: limit,
      skip: offset
    });

    return allBooks;
  }

  async getBookById(id: string) {
    const findBook = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!findBook) {
      throw new HttpException("O livro não foi encontrado!", HttpStatus.NOT_FOUND);
    }

    return findBook;
  }

  async createBook(dto: CreateBookDto) {
    const existingBook = await this.prisma.book.findFirst({
      where: {
        title: dto.title,
      }
    })
  
    if (existingBook) {
      throw new HttpException(
        "Já existe um livro com esse título e autor.",
        HttpStatus.CONFLICT
      );
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

  async updateBook(id: string, dto: UpdateBookDto) {
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
}
