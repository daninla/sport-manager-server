import { Router } from 'express';

import userRoutes from './user.routes.js';
import adminRoutes from './admin.routes.js';
import playerRoutes from './player.routes.js';
import judgeRoutes from './judge.routes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/admins', adminRoutes);
router.use('/judges', judgeRoutes);
router.use('/players', playerRoutes);

export default router;
