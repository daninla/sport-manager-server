import { Router } from 'express';

import { playerController } from '../controllers/index.js';
import { validateBySchema } from '../middleware/index.js';
import {
  PLAYER_VALIDATION_SCHEMA,
  PLAYER_PATCH_VALIDATION_SCHEMA,
} from '../utils/validationSchemas/index.js';

const router = new Router();

const validatePlayer = validateBySchema(PLAYER_VALIDATION_SCHEMA);
const validatePatchPlayer = validateBySchema(PLAYER_PATCH_VALIDATION_SCHEMA);

router
  .route('/')
  .get(playerController.getPlayers)
  .post(validatePlayer, playerController.createPlayer);

router
  .route('/:playerId')
  .get(playerController.getPlayerById)
  .patch(validatePatchPlayer, playerController.updatePlayer)
  .delete(playerController.deletePlayer);

export default router;
