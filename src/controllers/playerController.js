import db from '../config/db.js';

class Player {
  async getPlayers(_, res, next) {
    try {
      const players = await db.query(`SELECT * FROM players;`);
      res.json(players.rows);
    } catch (error) {
      next(error);
    }
  }

  async getPlayerById(req, res, next) {
    try {
      const {
        params: { playerId },
      } = req;
      const player = await db.query(
        `
          SELECT *
          FROM players
          WHERE id = $1;
        `,
        [playerId],
      );
      res.json(player.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async createPlayer(req, res, next) {
    try {
      const {
        first_name,
        last_name,
        birth_date,
        city,
        rank_category,
        ukr_rating,
        world_rating,
        club,
        notes,
        created_at,
      } = req.body;
      const createdPlayer = await db.query(
        `
        INSERT INTO players
        (first_name,
        last_name,
        birth_date,
        city,
        rank_category,
        ukr_rating,
        world_rating,
        club,
        notes,
        created_at)
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
        `,
        [
          first_name,
          last_name,
          birth_date,
          city,
          rank_category,
          ukr_rating,
          world_rating,
          club,
          notes,
          created_at,
        ],
      );
      res.json(createdPlayer.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async updatePlayer() {
    try {
      const {
        params: {
          player_Id,
          first_name,
          last_name,
          birth_date,
          city,
          rank_category,
          ukr_rating,
          world_rating,
          club,
          notes,
          created_at,
        },
      } = req;
      const updatedPlayer = await db.query(
        `
        UPDATE players
        SET 
        first_name = $2,
        last_name = $3,
        birth_date = $4,
        city = $5,
        rank_category = $6,
        ukr_rating = $7,
        world_rating = $8,
        club = $9,
        notes = $10,
        created_at = $11
        WHERE id = $1
        RETURNING *;`,
        [
          player_Id,
          first_name,
          last_name,
          birth_date,
          city,
          rank_category,
          ukr_rating,
          world_rating,
          club,
          notes,
          created_at,
        ],
      );
    } catch (error) {
      next(error);
    }
  }

  async deletePlayer(req, res, next) {
    try {
      const {
        params: { playerId },
      } = req;
      const deletedPlayer = await db.query(
        `
          DELETE FROM players
          WHERE id = $1
          RETURNING *;
        `,
        [playerId],
      );
      if (deletedPlayer.rows.length) {
        res.json(deletedPlayer.rows[0]);
      } else {
        res.status(404).send('Player not found');
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new Player();
