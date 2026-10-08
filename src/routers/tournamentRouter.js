import { Router } from 'express';

import tournamentController from '../controllers/tournamentController.js';

const router = new Router();

router.route('/').get(tournamentController.getTournaments).post(tournamentController.createTournament);

router.route('/:id').get(tournamentController.getTournamentById).delete(tournamentController.deleteTournament);

export default router;
