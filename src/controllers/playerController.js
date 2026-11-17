import db from '../database/models/index.js';

class PlayerController {
    async getPlayers(req, res, next) {
        try {
            const players = await db.User.findAll({
                include: { model: db.UserRole, where: { title: 'player' } },
                raw: true,
                order: [['id', 'ASC']],
            });
            if (players.length > 0) {
                res.status(200).send(players);
            } else {
                next(createError(404, 'Players not found'));
            }
        } catch (error) {
            next(error);
        }
    }
}

export default new PlayerController();
