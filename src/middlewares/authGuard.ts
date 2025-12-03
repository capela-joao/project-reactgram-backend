import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

const jwtSecret = process.env.JWT_TOKEN as string;

export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ errors: ['Acesso negado!'] });
  }

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ errors: ['Token não fornecido!'] });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as unknown as { id: string };

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(404).json({ errors: ['Usuário não encontrado!'] });
    }
    next();
  } catch (err) {
    res.status(401).json({ erros: ['Token inválido'] });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = req.user;

  res.status(200).json(user);
};
