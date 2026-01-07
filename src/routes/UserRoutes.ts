/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Rotas relacionadas a usuários
 */

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

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - username
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: João
 *               lastName:
 *                 type: string
 *                 example: Paulo
 *               username:
 *                 type: string
 *                 example: joaopaulo
 *               email:
 *                 type: string
 *                 example: joaopaulo@gmail.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *               confirmPassword:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponseRegister'
 *       422:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', userCreateValidation(), validate, register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Autentica o usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: joaopaulo@gmail.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponseLogin'
 *       404:
 *         description: Usuário não encontrado
 *       422:
 *         description: Senha inválida
 */
router.post('/login', loginValidation(), validate, login);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Retorna os dados do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token inválido ou não enviado
 */
router.get('/profile', authGuard, getCurrentUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', getUserById);

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Atualiza os dados do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *               bio:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autorizado
 */
router.put(
  '/',
  authGuard,
  userUpdateValidation(),
  validate,
  imageUpload.single('profileImage'),
  update
);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Realiza logout do usuário
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    ...(process.env.NODE_ENV === 'production' && {
      domain: '.dev-joao.app.br',
    }),
    path: '/',
  });

  return res.status(200).json({ message: 'Logout realizado' });
});

export default router;
