import User from '../models/User.js';
import type { Request, Response } from 'express';
import mongoose from 'mongoose';
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

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

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

  return res.status(200).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};

export const update = async (req: Request, res: Response) => {
  const { name, password, bio } = req.body;

  let profileImage = null;

  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;

  const user = await User.findById(reqUser._id).select('-password');

  if (!user) {
    return;
  }

  if (name) {
    user.name = name;
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

  res.status(200).json(user);
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

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
