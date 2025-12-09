import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = '';

    if (req.baseUrl.includes('users')) {
      folder = 'users';
    } else if (req.baseUrl.includes('photos')) {
      folder = 'photos';
    }

    const uploadPath = `uploads/${folder}`;

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(new Error('Por favor, envie apenas png ou jpg!'));
    }
    cb(null, true);
  },
});

export const photoUpdateValidation = () => {};
