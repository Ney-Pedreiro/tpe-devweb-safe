import { Router } from 'express';
import { BookController } from '../controllers/book.controller';
import { authenticateSession, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();
const bookController = new BookController();

// Rotas públicas (apenas leitura para usuários autenticados)
router.get('/', authenticateSession, bookController.getAllBooks.bind(bookController));
router.get('/:id', authenticateSession, bookController.getBookById.bind(bookController));

// Rotas administrativas (CRUD completo)
router.post('/', authenticateSession, requireAdmin, bookController.createBook.bind(bookController));
router.put('/:id', authenticateSession, requireAdmin, bookController.updateBook.bind(bookController));
router.delete('/:id', authenticateSession, requireAdmin, bookController.deleteBook.bind(bookController));

export default router;
