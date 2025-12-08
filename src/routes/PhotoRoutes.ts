import express from 'express';
import { photoInsertValidation } from '../middlewares/photoValidation.js';
import { authGuard } from '../middlewares/authGuard.js';
import { validate } from '../middlewares/handleValidation.js';
import { deletePhoto, insertPhoto } from '../controllers/PhotoController.js';
import { imageUpload } from '../middlewares/imageUpload.js';

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

export default router;
