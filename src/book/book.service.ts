import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  async createBook(dto: CreateBookDto) {
    const newBook = await this.prisma.book.create({
      data: {
        title: dto.title,
        author: dto.author,
        description: dto.description,
        year: dto.year
      }
    })

    return newBook;
  }

  async updateBook(id: string, dto: UpdateBookDto) {
    const findBook = await this.prisma.book.findFirst({
      where: { id },
    })

    if(!findBook) {
      throw new HttpException("O livro não foi encontrado!", HttpStatus.NOT_FOUND);
    }

    const updatedBook = await this.prisma.book.update({
      where: {
        id: findBook.id,
      },
      data: dto,
    })

    return updatedBook;
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
