import db from '../config/db.js';

class Player {
  async getPlayers(_, res, next) {
    try {
      const players = await db.query(`
        SELECT u.first_name, u.last_name, u.email AS user_email, p.*
        FROM player_profile p
        LEFT JOIN users u ON p.user_id = u.id
        ORDER BY p.id;
      `);
      res.json(players.rows);
    } catch (error) {
      next(error);
    }
  }

  async getPlayerById(req, res, next) {
    try {
      const { playerId } = req.params;
      const player = await db.query(
        `
          SELECT u.first_name, u.last_name, u.email AS user_email, p.*
          FROM player_profile p
          LEFT JOIN users u ON p.user_id = u.id
          WHERE p.id = $1;
        `,
        [playerId],
      );

      if (player.rows.length) {
        res.json(player.rows[0]);
      } else {
        res.status(404).send('Player not found');
      }
    } catch (error) {
      next(error);
    }
  }

  async createPlayer(req, res, next) {
    try {
      const {
        ukr_rate,
        rank_category,
        club,
        notes,
        sex,
        birth_date,
        city,
        user_id,
      } = req.body;

      const createdPlayer = await db.query(
        `
          WITH new_player AS (
            INSERT INTO player_profile
              (ukr_rate, rank_category, club, notes, sex, birth_date, city, user_id)
            VALUES
              ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
          ), assigned_role AS (
            INSERT INTO user_roles (user_id, role_id)
            SELECT new_player.user_id, roles.id
            FROM new_player
            CROSS JOIN roles
            WHERE roles.title = 'player'
            ON CONFLICT (user_id, role_id) DO NOTHING
            RETURNING user_id
          )
          SELECT u.first_name, u.last_name, u.email AS user_email, new_player.*
          FROM new_player
          LEFT JOIN users u ON u.id = new_player.user_id;
        `,
        [
          ukr_rate,
          rank_category,
          club,
          notes,
          sex,
          birth_date,
          city,
          user_id,
        ],
      );
      res.status(201).json(createdPlayer.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async updatePlayer(req, res, next) {
    try {
      const { playerId } = req.params;
      const {
        ukr_rate,
        rank_category,
        club,
        notes,
        sex,
        birth_date,
        city,
      } = req.body;

      const updatedPlayer = await db.query(
        `
          WITH updated_player AS (
            UPDATE player_profile
            SET
              ukr_rate = $2,
              rank_category = $3,
              club = $4,
              notes = $5,
              sex = $6,
              birth_date = $7,
              city = $8
            WHERE id = $1
            RETURNING *
          )
          SELECT u.first_name, u.last_name, u.email AS user_email, updated_player.*
          FROM updated_player
          LEFT JOIN users u ON u.id = updated_player.user_id;
        `,
        [
          playerId,
          ukr_rate,
          rank_category,
          club,
          notes,
          sex,
          birth_date,
          city,
        ],
      );

      if (updatedPlayer.rows.length) {
        res.json(updatedPlayer.rows[0]);
      } else {
        res.status(404).send('Player not found');
      }
    } catch (error) {
      next(error);
    }
  }

  async deletePlayer(req, res, next) {
    try {
      const { playerId } = req.params;
      const deletedPlayer = await db.query(
        `
          WITH deleted_player AS (
            DELETE FROM player_profile
            WHERE id = $1
            RETURNING id, user_id
          ), deleted_role AS (
            DELETE FROM user_roles ur
            USING roles r, deleted_player p
            WHERE ur.user_id = p.user_id
              AND ur.role_id = r.id
              AND r.title = 'player'
            RETURNING ur.user_id
          )
          SELECT id FROM deleted_player;
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
