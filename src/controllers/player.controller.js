
import db from '../config/db.js';

class Player {
  async getPlayers(_, res, next) {
    try {
      const players = await db.query(`
        SELECT
          u.first_name,
          u.last_name,
          u.email AS user_email,
          p.*,
          COALESCE(
            (
              SELECT json_agg(
                json_build_object(
                  'ukr_rate', r.ukr_rate,
                  'updated_at', r.updated_at
                )
                ORDER BY r.updated_at ASC, r.id ASC
              )
              FROM player_ukr_rates r
              WHERE r.player_id = p.id
            ),
            '[]'::json
          ) AS ukr_rates
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
          SELECT
            u.first_name,
            u.last_name,
            u.email AS user_email,
            p.*,
            COALESCE(
              (
                SELECT json_agg(
                  json_build_object(
                    'ukr_rate', r.ukr_rate,
                    'updated_at', r.updated_at
                  )
                  ORDER BY r.updated_at ASC, r.id ASC
                )
                FROM player_ukr_rates r
                WHERE r.player_id = p.id
              ),
              '[]'::json
            ) AS ukr_rates
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
              (rank_category, club, notes, sex, birth_date, city, user_id)
            VALUES
              ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
          ),
          assigned_role AS (
            INSERT INTO user_roles (user_id, role_id)
            SELECT new_player.user_id, roles.id
            FROM new_player
            CROSS JOIN roles
            WHERE roles.title = 'player'
            ON CONFLICT (user_id, role_id) DO NOTHING
            RETURNING user_id
          ),
          new_rate AS (
            INSERT INTO player_ukr_rates (ukr_rate, player_id)
            SELECT $8::numeric, id
            FROM new_player
            WHERE $8::numeric IS NOT NULL
            RETURNING *
          )
          SELECT
            u.first_name,
            u.last_name,
            u.email AS user_email,
            new_player.*,
            COALESCE(
              (
                SELECT json_agg(
                  json_build_object(
                    'ukr_rate', r.ukr_rate,
                    'updated_at', r.updated_at
                  )
                  ORDER BY r.updated_at ASC, r.id ASC
                )
                FROM new_rate r
              ),
              '[]'::json
            ) AS ukr_rates
          FROM new_player
          LEFT JOIN users u ON u.id = new_player.user_id;
        `,
        [
          rank_category,
          club,
          notes,
          sex,
          birth_date,
          city,
          user_id,
          ukr_rate ?? null,
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
              rank_category = $2,
              club = $3,
              notes = $4,
              sex = $5,
              birth_date = $6,
              city = $7
            WHERE id = $1
            RETURNING *
          ),
          new_rate AS (
            INSERT INTO player_ukr_rates (ukr_rate, player_id)
            SELECT $8::numeric, id
            FROM updated_player
            WHERE $8::numeric IS NOT NULL
            RETURNING *
          )
          SELECT
            u.first_name,
            u.last_name,
            u.email AS user_email,
            updated_player.*,
            COALESCE(
              (
                SELECT json_agg(
                  json_build_object(
                    'ukr_rate', r.ukr_rate,
                    'updated_at', r.updated_at
                  )
                  ORDER BY r.updated_at ASC, r.id ASC
                )
                FROM (
                  SELECT
                    r.id,
                    r.ukr_rate,
                    r.updated_at
                  FROM player_ukr_rates r
                  WHERE r.player_id = updated_player.id

                  UNION ALL

                  SELECT
                    nr.id,
                    nr.ukr_rate,
                    nr.updated_at
                  FROM new_rate nr
                ) r
              ),
              '[]'::json
            ) AS ukr_rates
          FROM updated_player
          LEFT JOIN users u ON u.id = updated_player.user_id;
        `,
        [
          playerId,
          rank_category,
          club,
          notes,
          sex,
          birth_date,
          city,
          ukr_rate ?? null,
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
          ),
          deleted_role AS (
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
