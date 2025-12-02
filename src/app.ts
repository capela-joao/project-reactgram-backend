import 'dotenv/config';

import './config/db.js';

import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

import router from './routes/Router.js';

const port = Number(process.env.PORT);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);

app.listen(port, '0.0.0.0', () => {
  console.log(`App rodando na porta ${port}`);
  console.log(`${port}`);
});
