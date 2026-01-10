import Photo from '../models/Photo.js';
import mongoose from 'mongoose';
import type { Request, Response } from 'express';
import User from '../models/User.js';
import { uploadToCloudinary } from '../middlewares/imageUpload.js';

export const insertPhoto = async (req: Request, res: Response) => {
  const { title } = req.body;
  const reqUser = req.user;

  try {
    const user = await User.findById(reqUser._id);

    if (!user) {
      return res.status(404).json({ errors: ['Usuário não encontrado'] });
    }

    let image = null;

    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file, req);
        image = result.secure_url;
      } catch (err) {
        return res.status(500).json({
          errors: ['Erro ao fazer upload de imagem'],
        });
      }
    }

    const newPhoto = await Photo.create({
      image,
      title,
      user: user._id,
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

    if (!photo.user || !photo.user.equals(reqUser._id)) {
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
    .populate('user', 'username profileImage')
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
    const photos = await Photo.find({ user: id })
      .populate('user', 'username profileImage')
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

    if (!photo.user || !photo.user.equals(reqUser._id)) {
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

export const likePhoto = async (req: Request, res: Response) => {
  const { id } = req.params;

  const reqUser = req.user;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ errors: ['Id Inválido'] });
  }
  try {
    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({ errors: ['Foto não encontrada.'] });
    }

    if (photo.likes.includes(reqUser._id)) {
      return res.status(422).json({ errors: ['Você já curtiu a foto.'] });
    }

    photo.likes.push(reqUser._id);

    photo.save();

    res.status(200).json({
      photoId: id,
      userId: reqUser._id,
      message: 'A foto foi curtida.',
    });
  } catch (err) {
    return res.status(500).json({ errors: ['Erro ao curtir foto.'] });
  }
};

export const commentPhoto = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { comment } = req.body;

  const reqUser = req.user;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ errors: ['ID inválido.'] });
  }

  try {
    const user = await User.findById(reqUser._id);

    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({ errors: ['Foto não encontrada.'] });
    }

    if (!user) {
      return res.status(404).json({ errors: ['Usuário não encontrado.'] });
    }

    const userComment = {
      comment,
      userName: user.username,
      userImage: user.profileImage,
      userId: user._id,
    };

    photo.comments.push(userComment);

    await photo.save();

    return res.status(200).json({
      comment: userComment,
      message: 'O comentário foi feito com sucesso.',
    });
  } catch (err) {
    return res.status(500).json({ errors: ['Erro ao comentar foto.'] });
  }
};

export const searchPhotos = async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ errors: ['Parâmetro q é obrigatório'] });
  }

  try {
    const photos = await Photo.find({ title: new RegExp(q, 'i') })
      .populate('user', 'username profileImage')
      .exec();

    res.status(200).json(photos);
  } catch (err) {
    return res.status(500).json({ errors: ['Erro ao procurar foto.'] });
  }
};
