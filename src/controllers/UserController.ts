import User from '../models/User.js';
import type { Request, Response } from 'express';
import mongoose, { mongo } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoServerError } from 'mongodb';

const jwtToken = process.env.JWT_TOKEN as string;

const generateToken = (id: any) => {
  return jwt.sign({ id }, jwtToken, {
    expiresIn: '7d',
  });
};

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      username,
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
  } catch (err: unknown) {
    if (err instanceof MongoServerError && err.code === 11000) {
      return res
        .status(422)
        .json({ errors: ['E-mail ou usuário já cadastrado.'] });
    }
    return res.status(500).json({ errors: ['Erro ao cadastrar usuário.'] });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ errors: ['Usuário não encontrado.'] });
    }

    if (!user.password) {
      return res.status(500).json({ errors: ['Senha não encontrada.'] });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(422).json({ errors: ['Senha inválida'] });
    }

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: 'dev-joao.app.br',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      _id: user._id,
      profileImage: user.profileImage,
      message: 'Login realizado com sucesso.',
    });
  } catch (err) {
    return res.status(500).json({ errors: ['Erro ao efetuar login.'] });
  }
};

export const update = async (req: Request, res: Response) => {
  const { firstName, lastName, password, bio } = req.body;

  let profileImage = null;

  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;

  try {
    const user = await User.findById(reqUser._id);

    if (!user) {
      return res.status(404).json({ errors: ['Usuário não encontrado.'] });
    }

    if (firstName) {
      user.firstName = firstName;
    }

    if (lastName) {
      user.lastName = lastName;
    }

    if (password) {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      user.password = passwordHash;
    }

    if (bio) {
      user.bio = bio;
    }

    if (profileImage) {
      user.profileImage = profileImage;
    }

    await user.save();

    const { password: _, ...userData } = user.toObject();
    res.status(200).json(userData);
  } catch (err) {
    return res.status(500).json({ errors: ['Erro ao atualizar usuário.'] });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ errors: ['ID inválido.'] });
  }

  try {
    const user = await User.findOne({ _id: id }).select('-password');

    if (!user) {
      return res.status(404).json({ errors: ['Usuário não encontrado.'] });
    }

    res.status(200).json(user);
  } catch (err) {
    return res.status(422).json({ errors: ['Usuário não encontrado.'] });
  }
};
