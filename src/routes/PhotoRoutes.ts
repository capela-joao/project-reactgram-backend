import express from 'express';
import { photoInsertValidation } from '../middlewares/photoValidation.js';
import { authGuard } from '../middlewares/authGuard.js';
import { validate } from '../middlewares/handleValidation.js';
import {
  deletePhoto,
  getAllPhotos,
  getPhotoById,
  getUserPhotos,
  insertPhoto,
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

export default router;
