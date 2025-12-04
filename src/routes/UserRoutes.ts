import express from 'express';

import {
  register,
  login,
  update,
  getUserById,
} from '../controllers/UserController.js';
import { validate } from '../middlewares/handleValidation.js';
import {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
} from '../middlewares/userValidations.js';
import { authGuard, getCurrentUser } from '../middlewares/authGuard.js';
import { imageUpload } from '../middlewares/imageUpload.js';

const router = express.Router();

router.post('/register', userCreateValidation(), validate, register);
router.post('/login', loginValidation(), validate, login);

router.get('/profile', authGuard, getCurrentUser);
router.get('/:id', getUserById);

router.put(
  '/',
  authGuard,
  userUpdateValidation(),
  validate,
  imageUpload.single('profileImage'),
  update
);

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logout realizado' });
});

export default router;
