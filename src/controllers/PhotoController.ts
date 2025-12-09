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
    return;
  }

  console.log(req.body);

  res.status(201).json(newPhoto);
};

export const deletePhoto = async (req: Request, res: Response) => {
  const { id } = req.params;
  const reqUser = req.user;

  try {
    const photo = await Photo.findById(id);

    if (!photo) {
      res.status(404).json({
        errors: ['Foto não encontrada'],
      });
      return;
    }

    if (!photo.userId || !photo.userId.equals(reqUser._id)) {
      res.status(422).json({
        erros: ['Ocorreu um erro, por favor tente novamente mais tarde'],
      });
      return;
    }

    await Photo.findByIdAndDelete(photo._id);

    res.status(200).json({
      id: photo._id,
      message: 'Foto excluída com sucesso!',
    });
  } catch (err) {
    res.status(404).json({
      errors: ['Foto não encontrada'],
    });
    return;
  }
};

export const getAllPhotos = async (req: Request, res: Response) => {
  const photos = await Photo.find({})
    .sort([['createdAt', -1]])
    .exec();

  return res.status(200).json(photos);
};

export const getUserPhotos = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ errors: ['Id Inválido'] });
  }

  try {
    const photos = await Photo.find({ userId: new mongoose.Types.ObjectId(id) })
      .sort([['createdAt', -1]])
      .exec();

    return res.status(200).json(photos);
  } catch (err) {
    return res.status(404).json({ errors: ['Erro ao buscar fotos.'] });
  }
};

export const getPhotoById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const photo = await Photo.findById(id);

  if (!photo) {
    res.status(404).json({ errors: ['Foto não encontrada.'] });
    return;
  }

  res.status(200).json(photo);
};
