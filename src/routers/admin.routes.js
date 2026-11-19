import { Router } from 'express';

import { adminController } from '../controllers/index.js';

const router = new Router();

router
  .route('/')
  .get(adminController.getAdmins)
  .post(adminController.createAdmin);

router
  .route('/:adminId')
  .get(adminController.getAdminById)
  .delete(adminController.deleteAdmin);

export default router;
