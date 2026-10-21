import { Router } from 'express';

import playerController from '../controllers/playerController.js';
import { validatePlayer } from '../middleware/validate.mw.js';

const router = new Router();

router
  .route('/')
  .get(playerController.getPlayers)
  .post(validatePlayer, playerController.createPlayer);

router
  .route('/:playerId')
  .get(playerController.getPlayerById)
  .delete(playerController.deletePlayer)
  .put(validatePlayer, playerController.updatePlayer);

export default router;
