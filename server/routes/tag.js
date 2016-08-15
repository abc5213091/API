import express from 'express';
import tagCtrl from '../controllers/tag';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/')
  /** GET /api/users - Get list of users */
  .get(tagCtrl.list)

  /** POST /api/users - Create new user */
  .post(tagCtrl.create);

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(tagCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(tagCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(tagCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('tagID', tagCtrl.load);

export default router;
