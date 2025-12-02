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
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    res.status(422).json({ errors: ['Por favor, utilize outro e-mail.'] });
    return;
  }

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });

  if (!newUser) {
    res.status(422).json({
      errors: ['Houve um erro, por favor tente novamente mais tarde'],
    });
    return;
  }
  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id),
  });
};
