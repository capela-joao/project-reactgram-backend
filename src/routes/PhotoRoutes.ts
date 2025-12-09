import express from 'express';
import {
  commentValidation,
  photoInsertValidation,
  photoUpdateValidation,
} from '../middlewares/photoValidation.js';
import { authGuard } from '../middlewares/authGuard.js';
import { validate } from '../middlewares/handleValidation.js';
import {
  commentPhoto,
  deletePhoto,
  getAllPhotos,
  getPhotoById,
  getUserPhotos,
  insertPhoto,
  likePhoto,
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
router.put('/like/:id', authGuard, likePhoto);
router.put(
  '/comment/:id',
  authGuard,
  commentValidation(),
  validate,
  commentPhoto
);
export default router;
