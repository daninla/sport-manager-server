import { Router } from 'express';

import userController from '../controllers/userController.js';
import { validateUser } from '../middleware/validate.mw.js';

const router = new Router();

router
  .route('/')
  .get(userController.getUsers)
  .post(validateUser, userController.createUser)
  .put(validateUser, userController.updateUser);

router
  .route('/:userId')
  .get(userController.getUserById)
  .delete(userController.deleteUser);

export default router;
