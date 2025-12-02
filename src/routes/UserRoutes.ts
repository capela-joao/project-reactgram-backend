import express from 'express';

import { register } from '../controllers/UserController.js';
import { validate } from '../middlewares/handleValidation.js';
import { userCreateValidation } from '../middlewares/useValidations.js';

const router = express.Router();

router.post('/register', userCreateValidation(), validate, register);

export default router;
