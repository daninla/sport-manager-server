import { Router } from 'express';

import playerController from '../controllers/playerController.js';
import { validatePlayer } from '../middleware/validate.mw.js';

const router = new Router();

router
  .route('/')
  .get(playerController.getPlayers)
  .post(validatePlayer, playerController.createPlayer)
  .put(validatePlayer, playerController.updatePlayer);

router
  .route('/:playerId')
  .get(playerController.getPlayerById)
  .delete(playerController.deletePlayer);

export default router;
