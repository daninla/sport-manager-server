import { Router } from 'express';

import userRouters from './userRouters.js';
import playerRouters from './playerRouters.js';

const router = Router();

router.use('/users', userRouters);
router.use('/players', playerRouters);

export default router;
