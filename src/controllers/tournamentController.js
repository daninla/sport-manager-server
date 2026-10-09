import db from '../config/db.js';
import { toCamelCase } from '../utils/toCamelCase.js';

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
        case 'swiss':
            return 'Swiss System';
        case 'single_elimination':
        default:
            return 'Single Elimination';
    }
};

class TournamentController {
    async getTournaments(req, res, next) {
        try {
            const torunaments = await db.query(
                `
            SELECT * 
            FROM tournaments
            ORDER BY id
            `,
            );
            res.status(200).send(torunaments.rows.map(toCamelCase));
        } catch (error) {
            next(error);
        }
    }

    async getTournamentById(req, res, next) {
        try {
            const { id } = req.params;
            const tournament = await db.query(
                `
                SELECT *
                FROM tournaments
                WHERE id=$1
                `,
                [id],
            );
            res.status(200).send(toCamelCase(tournament.rows[0]));
        } catch (error) {
            next(error);
        }
    }

    async createTournament(req, res, next) {
        console.log(req.body)
        try {
            const {
                name,
                startsAt,
                location,
                tablesCount,
                status,
                tournamentType,
                format,
                bestOf,
                maxParticipants,
                isRated,
                ratingCoefficient,
                ageCategory,
                ratingLimit,
                gender,
                playersIds,
            } = req.body;

            const competitionType = mapCompetitionType(tournamentType);
            const bracketFormat = mapBracketFormat(format);

            const newTournament = await db.query(
                `
                INSERT INTO tournaments
                (name, starts_at, location, tables_count, competition_type, bracket_format, best_of, max_participants, is_rated, rating_coefficient, age_category, rating_limit, gender, status)
                VALUES 
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                RETURNING *
                `,
                [
                    name,
                    startsAt,
                    location,
                    tablesCount,
                    competitionType,
                    bracketFormat,
                    bestOf,
                    maxParticipants,
                    isRated,
                    ratingCoefficient,
                    ageCategory,
                    ratingLimit,
                    gender,
                    status,
                ],
            );

            res.status(201).send(toCamelCase(newTournament.rows[0]));
        } catch (err) {
            next(err);
        }
    }

    async updateTournament(req, res, next) {
        try {
            const { id } = req.params;
            const {
                name,
                startsAt,
                location,
                tablesCount,
                status,
                tournamentType,
                format,
                bestOf,
                maxParticipants,
                isRated,
                ratingCoefficient,
                ageCategory,
                ratingLimit,
                gender,
                playersIds,
            } = req.body;

            const competitionType = mapCompetitionType(tournamentType);
            const bracketFormat = mapBracketFormat(format);

            const updatedTournament = await db.query(
                `
                UPDATE tournaments
                SET
                name=$1,
                starts_at=$2,
                location=$3,
                tables_count=$4,
                competition_type=$5,
                bracket_format=$6,
                best_of=$7,
                max_participants=$8,
                is_rated=$9,
                rating_coefficient=$10,
                age_category=$11,
                rating_limit=$12,
                gender=$13,
                status=$14
                WHERE id=$15
                RETURNING *
                `,
                [
                    name,
                    startsAt,
                    location,
                    tablesCount,
                    competitionType,
                    bracketFormat,
                    bestOf,
                    maxParticipants,
                    isRated,
                    ratingCoefficient,
                    ageCategory,
                    ratingLimit,
                    gender,
                    status,
                    id,
                ],
            );

            if (updatedTournament.rows.length > 0) {
                res.status(200).send(toCamelCase(updatedTournament.rows[0]));
            } else {
                res.status(404).send('Tournament not found');
            }
        } catch (error) {
            next(error);
        }
    }

    async deleteTournament(req, res, next) {
        try {
            const { id } = req.params;
            const delTournament = await db.query(
                `
                DELETE FROM tournaments
                WHERE id=$1
                RETURNING id
                `,
                [id],
            );
            if (delTournament.rows.length > 0) {
                res.status(200).send(delTournament.rows[0]);
            } else {
                res.status(404).send('Tournament not found');
            }
        } catch (err) {
            next(error);
        }
    }
}

export default new TournamentController();
