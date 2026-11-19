import { Router } from 'express';

import { userController } from '../controllers/index.js';
import { validateBySchema } from '../middleware/index.js';
import {
  USER_VALIDATION_SCHEMA,
  USER_PATCH_VALIDATION_SCHEMA,
  USER_DELETE_VALIDATION_SCHEMA,
} from '../utils/validationSchemas/index.js';

const router = new Router();

const validateUser = validateBySchema(USER_VALIDATION_SCHEMA);
const validatePatchUser = validateBySchema(USER_PATCH_VALIDATION_SCHEMA);
const validateDeleteUser = validateBySchema(USER_DELETE_VALIDATION_SCHEMA);

router
  .route('/')
  .get(userController.getUsers)
  .post(validateUser, userController.createUser);

router
  .route('/:userId')
  .get(userController.getUserById)
  .patch(validatePatchUser, userController.updateUser)
  .delete(validateDeleteUser, userController.deleteUser);

export default router;
