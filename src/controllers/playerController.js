import db from '../database/models/index.js';

class PlayerController {
    async getPlayers(req, res, next) {
        try {
            const players = await db.User.findAll({
                attributes: ['id', 'firstName', 'lastName'],
                include: {
                    model: db.UserRole,
                    attributes: [],
                    required: true,
                    include: {
                        model: db.Role,
                        attributes: [],
                        where: { title: 'player' },
                    },
                },
                order: [['id', 'ASC']],
            });
            res.status(200).send(players);
        } catch (error) {
            next(error);
        }
    }
}

export default new PlayerController();
