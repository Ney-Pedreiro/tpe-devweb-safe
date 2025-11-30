import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { username, password, role } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: 'Username e password são obrigatórios' });
      }

      // Verificar se usuário já existe
      const existingUser = await userService.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ error: 'Usuário já existe' });
      }

      const user = await userService.createUser({
        username,
        password,
        role: role || 'USER'
      });

      res.status(201).json({ 
        message: 'Usuário criado com sucesso',
        user
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: 'Username e password são obrigatórios' });
      }

      const user = await userService.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const isValidPassword = await userService.validatePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Criar sessão
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role
      };

      res.json({
        message: 'Login realizado com sucesso',
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao fazer logout' });
      }
      res.json({ message: 'Logout realizado com sucesso' });
    });
  }
}
