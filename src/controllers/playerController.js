import db from '../config/db.js';

class Player {
  async getPlayers(_, res, next) {
    try {
      const players = await db.query(`
        SELECT u.first_name, u.last_name, p.*, r.ukr_rating
        FROM players p
        LEFT JOIN player_ukr_rating r ON p.id = r.player_id
        LEFT JOIN users u ON p.user_id = u.id;
      `);
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
          SELECT u.first_name, u.last_name, p.*, r.ukr_rating 
          FROM players p
          LEFT JOIN player_ukr_rating r ON p.id = r.player_id
          LEFT JOIN users u ON p.user_id = u.id
          WHERE p.id = $1;
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
        birth_date,
        city,
        rank_category,
        ukr_rating,
        club,
        notes,
        user_email,
      } = req.body;
      const createdPlayer = await db.query(
        `
        WITH new_player AS (
          INSERT INTO players 
            (birth_date, city, rank_category, club, notes, user_id)
          VALUES 
            ($1, $2, $3, $4, $5, (
              SELECT id FROM users u WHERE u.email = $7
            ))
          RETURNING *
        ), new_rating AS (
          INSERT INTO player_ukr_rating 
            (player_id, ukr_rating)
          SELECT id, $6
          FROM new_player
          RETURNING ukr_rating
        )
        SELECT u.first_name, u.last_name, new_player.*, new_rating.ukr_rating
        FROM new_player
        LEFT JOIN users u ON u.id = new_player.user_id
        CROSS JOIN new_rating
        `,
        [
          birth_date, // $1
          city, // $2
          rank_category, // $3
          club, // $4
          notes, // $5
          ukr_rating, // $6
          user_email, // $7
        ],
      );
      res.json(createdPlayer.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async updatePlayer(req, res, next) {
    try {
      const { playerId } = req.params;
      const {
        birth_date,
        city,
        rank_category,
        ukr_rating,
        club,
        notes,
        updated_at,
      } = req.body;
      const updatedPlayer = await db.query(
        `
        WITH updated_player AS (
          UPDATE players
          SET
            birth_date = $2,
            city = $3,
            rank_category = $4,
            club = $5,
            notes = $6,
            updated_at = $7
          WHERE id = $1
          RETURNING *
        ), updated_rating AS (
          UPDATE player_ukr_rating
          SET
            ukr_rating = $8,
            updated_at = $7
          WHERE player_id = $1
          RETURNING ukr_rating
        )
        SELECT u.first_name, u.last_name, updated_player.*, updated_rating.ukr_rating
        FROM updated_player
        LEFT JOIN users u ON u.id = updated_player.user_id
        CROSS JOIN updated_rating
        `,
        [
          playerId, // $1
          birth_date, // $2
          city, // $3
          rank_category, // $4
          club, // $5
          notes, // $6
          updated_at, // $7
          ukr_rating, // $8
        ],
      );
      res.json(updatedPlayer.rows[0]);
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
          RETURNING id;
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
