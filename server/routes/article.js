import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import articleCtrl from '../controllers/article';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/')
  /** GET /api/users - Get list of users */
  .get(articleCtrl.list)

  /** POST /api/users - Create new user */
  .post(articleCtrl.create);

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(articleCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(articleCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(articleCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('userId', articleCtrl.load);

export default router;
