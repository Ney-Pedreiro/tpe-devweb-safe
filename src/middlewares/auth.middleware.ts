import { Request, Response, NextFunction } from 'express';

declare module 'express-session' {
  interface SessionData {
    user: {
      id: number;
      username: string;
      role: 'USER' | 'ADMIN';
    };
  }
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: 'USER' | 'ADMIN';
  };
}

export const authenticateSession = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Login necessário' });
  }
  
  req.user = req.session.user;
  next();
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
};
