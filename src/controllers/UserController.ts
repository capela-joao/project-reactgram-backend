import User from '../models/User.js';
import type { Request, Response } from 'express';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const jwtToken = process.env.JWT_TOKEN as string;

const generateToken = (id: any) => {
  return jwt.sign({ id }, jwtToken, {
    expiresIn: '7d',
  });
};

export const register = async (req: Request, res: Response) => {
  res.send('Register');
};
