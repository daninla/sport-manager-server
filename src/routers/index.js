import { Router } from 'express';

import torunamentRouter from './tournamentRouter.js';
import playerRouter from './playerRouter.js';

const router = new Router();

router.use('/tournaments', torunamentRouter);
router.use('/players', playerRouter);

export default router;
