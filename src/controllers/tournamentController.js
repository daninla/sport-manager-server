import createHttpError from 'http-errors';
import db from '../database/models/index.js';

const mapCompetitionType = (type) => {
    switch (type) {
        case 'team':
            return 'Team';
        case 'double':
            return 'Double';
        case 'single':
        default:
            return 'Single';
    }
};

const mapBracketFormat = (format) => {
    switch (format) {
        case 'round_robin':
            return 'Round Robin';
        case 'swiss_system':
            return 'Swiss System';
        case 'mixed_system':
            return 'Mixed System';
        case 'single_elimination':
        default:
            return 'Single Elimination';
    }
};

class TournamentController {
    async getTournaments(req, res, next) {
        try {
            const tournaments = await db.Tournament.findAll({
                raw: true,
                order: [['id', 'ASC']],
            });
            if (tournaments.length > 0) {
                res.status(200).send(tournaments);
            } else {
                next(createHttpError(404, 'Tournaments not found'));
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async getTournamentById(req, res, next) {
        try {
            const { id } = req.params;
            const tournament = await db.Tournament.findByPk(id, { raw: true });
            if (tournament) {
                res.status(200).send(tournament);
            } else {
                next(createHttpError(404, 'Tournament not found'));
            }
        } catch (error) {
            next(error);
        }
    }

    async createTournament(req, res, next) {
        try {
            const { competitionType, bracketFormat, ...tournamentData } = req.body;
            const newTournament = await db.Tournament.create(
                {
                    ...tournamentData,
                    competitionType: mapCompetitionType(competitionType),
                    bracketFormat: mapBracketFormat(bracketFormat),
                },
                { raw: true },
            );
            if (newTournament) {
                res.status(201).send(newTournament);
            } else {
                next(createHttpError(404, 'Tournament not found'));
            }
        } catch (error) {
            next(error);
        }
    }

    async updateTournament(req, res, next) {
        try {
            const { id } = req.params;
            const { competitionType, bracketFormat, ...tournamentData } = req.body;
            const [count, [updatedTournament]] = await db.Tournament.update(
                {
                    ...tournamentData,
                    competitionType: mapCompetitionType(competitionType),
                    bracketFormat: mapBracketFormat(bracketFormat),
                },
                { where: { id }, returning: true },
            );
            if (count && updatedTournament) {
                res.status(200).send(updatedTournament);
            } else {
                next(createHttpError(404, 'Tournament not found'));
            }
        } catch (error) {
            next(error);
        }
    }

    async deleteTournament(req, res, next) {
        try {
            const { id } = req.params;
            const count = await db.Tournament.destroy({ where: { id } });
            if (count) {
                res.status(204).end();
            } else {
                next(createHttpError(404, 'Tournament not found'));
            }
        } catch (error) {
            next(error);
        }
    }
}

export default new TournamentController();
