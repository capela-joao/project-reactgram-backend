import { Router } from 'express';
import UserRoutes from '../routes/UserRoutes.js';
import PhotoRoutes from '../routes/PhotoRoutes.js';

const router = Router();

router.use('/api/users', UserRoutes);
router.use('/api/photos', PhotoRoutes);

router.get('/', (req, res) => {
  res.send('API WORKING!');
});

export default router;
