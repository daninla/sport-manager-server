import db from '../config/db.js';

class Player {
  async getPlayers(_, res, next) {
    try {
      const players = await db.query(`
        SELECT p.*, r.ukr_rating 
        FROM players p
        LEFT JOIN player_ukr_rating r ON p.id = r.player_id;
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
          SELECT p.*, r.ukr_rating 
          FROM players p
          LEFT JOIN player_ukr_rating r ON p.id = r.player_id
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
        first_name,
        last_name,
        birth_date,
        city,
        rank_category,
        ukr_rating,
        club,
        notes,
        created_at,
        updated_at,
      } = req.body;
      const createdPlayer = await db.query(
        `
        WITH new_player AS (
          INSERT INTO players 
            (first_name, last_name, birth_date, city, rank_category, club, notes, updated_at)
          VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *
        ), new_rating AS (
          INSERT INTO player_ukr_rating 
            (player_id, ukr_rating, updated_at)
          SELECT id, $9, $8 
          FROM new_player
          RETURNING ukr_rating
        )
        SELECT new_player.*, new_rating.ukr_rating
        FROM new_player, new_rating;
        `,
        [
          first_name, // $1
          last_name, // $2
          birth_date, // $3
          city, // $4
          rank_category, // $5
          club, // $6
          notes, // $7
          updated_at, // $8
          ukr_rating, // $9
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
        first_name,
        last_name,
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
            first_name = $2,
            last_name = $3,
            birth_date = $4,
            city = $5,
            rank_category = $6,
            club = $7,
            notes = $8,
            updated_at = $9
          WHERE id = $1
          RETURNING *
        ), updated_rating AS (
          UPDATE player_ukr_rating
          SET 
            ukr_rating = $10, 
            updated_at = $9
          WHERE player_id = $1
          RETURNING ukr_rating
        )
        SELECT updated_player.*, updated_rating.ukr_rating
        FROM updated_player, updated_rating;
        `,
        [
          playerId, // $1
          first_name, // $2
          last_name, // $3
          birth_date, // $4
          city, // $5
          rank_category, // $6
          club, // $7
          notes, // $8
          updated_at, // $9
          ukr_rating, // $10
        ],
      );
      res.json(updatedPlayer.rows[0]);
    } catch (error) {
      next(error);
      g;
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
