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
  searchPhotos,
  updatePhoto,
} from '../controllers/PhotoController.js';
import { imageUpload } from '../middlewares/imageUpload.js';
import { getUserById } from '../controllers/UserController.js';

const router = express.Router();

/**
 * @swagger
 * /photos:
 *   post:
 *     summary: Publica uma nova foto
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - title
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Foto criada com sucesso
 *       401:
 *         description: Não autorizado
 */
router.post(
  '/',
  authGuard,
  imageUpload.single('image'),
  photoInsertValidation(),
  validate,
  insertPhoto
);

/**
 * @swagger
 * /photos:
 *   get:
 *     summary: Retorna todas as fotos
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de fotos
 */
router.get('/', authGuard, getAllPhotos);

/**
 * @swagger
 * /photos/{id}:
 *   get:
 *     summary: Busca uma foto pelo ID
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Foto encontrada
 *       404:
 *         description: Foto não encontrada
 */
router.get('/:id', authGuard, getPhotoById);

/**
 * @swagger
 * /photos/user/{id}:
 *   get:
 *     summary: Retorna fotos de um usuário
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fotos do usuário
 */
router.get('/user/:id', authGuard, getUserPhotos);

/**
 * @swagger
 * /photos/search:
 *   get:
 *     summary: Busca fotos pelo título
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fotos encontradas
 */
router.get('/search', authGuard, searchPhotos);

/**
 * @swagger
 * /photos/{id}:
 *   put:
 *     summary: Atualiza o título da foto
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Foto atualizada
 */
router.put('/:id', authGuard, photoUpdateValidation(), validate, updatePhoto);

/**
 * @swagger
 * /photos/like/{id}:
 *   put:
 *     summary: Curte uma foto
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Foto curtida
 */
router.put('/like/:id', authGuard, likePhoto);

/**
 * @swagger
 * /photos/comment/{id}:
 *   put:
 *     summary: Comenta em uma foto
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comentário adicionado
 */
router.put(
  '/comment/:id',
  authGuard,
  commentValidation(),
  validate,
  commentPhoto
);

/**
 * @swagger
 * /photos/{id}:
 *   delete:
 *     summary: Remove uma foto
 *     tags: [Photos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Foto removida
 */
router.delete('/:id', authGuard, deletePhoto);
export default router;
