import { Request, Response } from 'express';
import { BookService } from '../services/book.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const bookService = new BookService();

export class BookController {
  async getAllBooks(req: Request, res: Response) {
    try {
      const books = await bookService.getAllBooks();
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getBookById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const book = await bookService.getBookById(parseInt(id));
      
      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async createBook(req: AuthRequest, res: Response) {
    try {
      const { titulo, ano, autor, descricao } = req.body;
      
      if (!titulo || !ano || !autor || !descricao) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      const book = await bookService.createBook({
        titulo,
        ano: parseInt(ano),
        autor,
        descricao
      });
      
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async updateBook(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { titulo, ano, autor, descricao } = req.body;
      
      const updateData: any = {};
      if (titulo !== undefined) updateData.titulo = titulo;
      if (ano !== undefined) updateData.ano = parseInt(ano);
      if (autor !== undefined) updateData.autor = autor;
      if (descricao !== undefined) updateData.descricao = descricao;

      const book = await bookService.updateBook(parseInt(id), updateData);
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async deleteBook(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      
      await bookService.deleteBook(parseInt(id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
