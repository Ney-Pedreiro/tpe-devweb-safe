import { prisma } from '../database/prisma';
import { CreateBookDTO, UpdateBookDTO } from '../types/book.types';

export class BookService {
  async getAllBooks() {
    return await prisma.book.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async getBookById(id: number) {
    return await prisma.book.findUnique({
      where: { id }
    });
  }

  async createBook(data: CreateBookDTO) {
    return await prisma.book.create({
      data
    });
  }

  async updateBook(id: number, data: UpdateBookDTO) {
    return await prisma.book.update({
      where: { id },
      data
    });
  }

  async deleteBook(id: number) {
    return await prisma.book.delete({
      where: { id }
    });
  }
}
