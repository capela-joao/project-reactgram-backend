import Photo from '../models/Photo.js';
import mongoose from 'mongoose';
import type { Request, Response } from 'express';
import User from '../models/User.js';

export const insertPhoto = async (req: Request, res: Response) => {
  const { title } = req.body;
  const image = req.file?.filename;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  if (!user) {
    return;
  }

  const newPhoto = await Photo.create({
    image: image ?? null,
    title,
    userId: user._id,
    userName: user.name ?? null,
  });

  if (!newPhoto) {
    res
      .status(422)
      .json({ errors: ['Houve um problema, tente novamente mais tarde.'] });
  }

  console.log(req.body);

  res.status(201).json(newPhoto);
};
