import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const imageStorage = multer.memoryStorage();

export const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error('Por favor, envie apenas png, jpeg ou jpg!'));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadToCloudinary = (
  file: Express.Multer.File,
  req: any
): Promise<any> => {
  return new Promise((resolve, reject) => {
    let folder = 'reactgram';

    if (req.baseUrl.includes('users')) {
      folder = 'reactgram/users';
    }
    if (req.baseUrl.includes('photos')) {
      folder = 'reactgram/photos';
    }
    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: `${Date.now()}`,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            return reject(
              new Error('Erro ao fazer upload de imagens no Cloudinary.')
            );
          }

          if (!result) {
            return reject(new Error('Erro desconhecido no upload de imagens.'));
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    } catch (err) {
      return reject(new Error('Erro ao processar upload de imagens.'));
    }
  });
};
