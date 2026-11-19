import { Router } from 'express';

import { judgeController } from '../controllers/index.js';

const router = new Router();

router
  .route('/')
  .get(judgeController.getJudges)
  .post(judgeController.createJudge);

router
  .route('/:judgeId')
  .get(judgeController.getJudgeById)
  .delete(judgeController.deleteJudge);

export default router;
