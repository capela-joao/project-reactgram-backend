import express from 'express';

import { register, login } from '../controllers/UserController.js';
import { validate } from '../middlewares/handleValidation.js';
import {
  userCreateValidation,
  loginValidation,
} from '../middlewares/useValidations.js';

const router = express.Router();

router.post('/register', userCreateValidation(), validate, register);
router.post('/login', loginValidation(), validate, login);

export default router;
