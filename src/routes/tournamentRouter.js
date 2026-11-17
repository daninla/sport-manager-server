import { Router } from 'express';

import tournamentController from '../controllers/tournamentController.js';
import { validate } from '../middleware/validation.mw.js';
import { tournamentSchema } from '../utils/schemas/tournamentSchema.js';

const router = new Router();

router
    .route('/')
    .get(tournamentController.getTournaments)
    .post(validate(tournamentSchema), tournamentController.createTournament);

router
    .route('/:id')
    .get(tournamentController.getTournamentById)
    .put(validate(tournamentSchema), tournamentController.updateTournament)
    .delete(tournamentController.deleteTournament);

export default router;
