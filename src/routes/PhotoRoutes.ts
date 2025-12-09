import express from 'express';
import {
  photoInsertValidation,
  photoUpdateValidation,
} from '../middlewares/photoValidation.js';
import { authGuard } from '../middlewares/authGuard.js';
import { validate } from '../middlewares/handleValidation.js';
import {
  deletePhoto,
  getAllPhotos,
  getPhotoById,
  getUserPhotos,
  insertPhoto,
  updatePhoto,
} from '../controllers/PhotoController.js';
import { imageUpload } from '../middlewares/imageUpload.js';
import { getUserById } from '../controllers/UserController.js';

const router = express.Router();

router.post(
  '/',
  authGuard,
  imageUpload.single('image'),
  photoInsertValidation(),
  validate,
  insertPhoto
);

router.delete('/:id', authGuard, deletePhoto);

router.get('/', authGuard, getAllPhotos);
router.get('/user/:id', authGuard, getUserPhotos);
router.get('/:id', authGuard, getPhotoById);

router.put('/:id', authGuard, photoUpdateValidation(), validate, updatePhoto);
export default router;
