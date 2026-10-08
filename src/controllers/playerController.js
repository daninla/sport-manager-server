import db from '../config/db.js';

class PlayerController {
    async getPlayerss(req, res, next) {
        try {
            const players = await db.query(
                `
            SELECT * 
            FROM players
            ORDER BY id
            `,
            );
            res.status(200).send(players.rows);
        } catch (error) {
            next(error);
        }
    }
}

export default new PlayerController();
