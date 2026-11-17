import { Router } from 'express';

import playerController from '../controllers/playerController.js';

const router = new Router();

router.route('/').get(playerController.getPlayers);

export default router;
