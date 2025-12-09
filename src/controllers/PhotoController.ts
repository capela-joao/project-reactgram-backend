import Photo from '../models/Photo.js';
import mongoose from 'mongoose';
import type { Request, Response } from 'express';
import User from '../models/User.js';

export const insertPhoto = async (req: Request, res: Response) => {
  const { title } = req.body;
  const image = req.file?.filename;

  const reqUser = req.user;

  try {
    const user = await User.findById(reqUser._id);

    if (!user) {
      return res.status(404).json({ errors: ['Usuário não encontrado'] });
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

    res.status(201).json(newPhoto);
  } catch (err) {
    return res.status(500).json({ errors: ['Erro ao criar foto.'] });
  }
};

export const deletePhoto = async (req: Request, res: Response) => {
  const { id } = req.params;
  const reqUser = req.user;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ errors: ['Id Inválido'] });
  }

  try {
    const photo = await Photo.findById(id);

    if (!photo) {
      res.status(404).json({
        errors: ['Foto não encontrada'],
      });
      return;
    }

    if (!photo.userId || !photo.userId.equals(reqUser._id)) {
      res.status(403).json({
        errors: ['Você não tem permissão para deletar essa foto.'],
      });
      return;
    }

    await Photo.findByIdAndDelete(id);

    res.status(200).json({
      id: photo._id,
      message: 'Foto excluída com sucesso!',
    });
  } catch (err) {
    res.status(500).json({
      errors: ['Erro ao excluir foto.'],
    });
    return;
  }
};

export const getAllPhotos = async (req: Request, res: Response) => {
  const photos = await Photo.find({})
    .lean()
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
    return res.status(500).json({ errors: ['Erro ao buscar fotos.'] });
  }
};

export const getPhotoById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ errors: ['Id Inválido'] });
  }

  const photo = await Photo.findById(id);

  if (!photo) {
    res.status(404).json({ errors: ['Foto não encontrada.'] });
    return;
  }

  res.status(200).json(photo);
};

export const updatePhoto = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;

  const reqUser = req.user;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ errors: ['Id Inválido'] });
  }

  try {
    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({ errors: ['Foto não encontrada.'] });
    }

    if (!photo.userId || !photo.userId.equals(reqUser._id)) {
      return res.status(403).json({
        errors: ['Você não tem permissão para atualizar essa foto.'],
      });
    }

    if (title) {
      photo.title = title;
    }

    await photo.save();

    res.status(200).json({ photo, message: 'Foto atualizada.' });
  } catch (err) {
    return res.status(500).json({ errors: ['Erro ao atualizar foto.'] });
  }
};
