import { Router } from 'express';
import UserRoutes from '../routes/UserRoutes.js';

const router = Router();

router.use('/api/users', UserRoutes);

router.get('/', (req, res) => {
  res.send('API WORKING!');
});

export default router;
