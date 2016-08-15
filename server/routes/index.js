import express from 'express';
import auth from '../controllers/auth';
import userRoutes from './user';
import articleRoutes from './article';
import tagRoutes from './tag';

const router = express.Router();	// eslint-disable-line new-cap

/** GET / - Check service health */
router.get('/', (req, res) =>
  res.send('API is OK')
);
router.get('/login', auth.getToken);
// router.use(auth.valid);
// mount user routes at /users
router.use('/user', userRoutes);
router.use('/article', articleRoutes);
router.use('/tag', tagRoutes);

export default router;
