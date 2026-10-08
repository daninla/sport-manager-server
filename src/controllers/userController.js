import db from '../config/db.js';

class User {
  async getUsers(_, res, next) {
    try {
      const users = await db.query(`SELECT * FROM users;`);
      res.json(users.rows);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { userId } = req.params;
      const user = await db.query(
        `
        SELECT * FROM users
        WHERE id = $1;
        `,
        [userId],
      );
      res.json(user.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const { email, password_hash, role, player_id, created_at } = req.body;
      const createdUser = await db.query(
        `
        INSERT 
        INTO users (email, password_hash, role, player_id, created_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `,
        [email, password_hash, role, player_id, created_at],
      );
      res.json(createdUser.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id, email, password_hash, role, player_id, created_at } =
        req.body;
      const updatedUser = await db.query(
        `
        UPDATE users
        SET 
        email = $2,
        password_hash = $3, 
        role = $4,
        player_id = $5,
        created_at = $6
        WHERE id = $1
        RETURNING *;
        `,
        [id, email, password_hash, role, player_id, created_at],
      );
      res.json(updatedUser.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { userId } = req.params;
      const deletedUser = await db.query(
        `
        DELETE FROM users
        WHERE id = $1
        RETURNING *;
        `,
        [userId],
      );
      if (deletedUser.rows.length) {
        res.json(deletedUser.rows[0]);
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new User();
