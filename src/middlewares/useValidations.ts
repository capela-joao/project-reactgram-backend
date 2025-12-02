import { body } from 'express-validator';

export const userCreateValidation = () => {
  return [body('name').isString().withMessage('O nome é obrigatório')];
};
