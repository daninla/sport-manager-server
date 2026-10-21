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
      const { first_name, last_name, email, password_hash, role, player_id } =
        req.body;
      const createdUser = await db.query(
        `
        INSERT 
        INTO users (first_name, last_name, email, password_hash, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `,
        [
          first_name, // $1
          last_name, // $2
          email, // $3
          password_hash, // $4
          role, // $5
        ],
      );
      res.json(createdUser.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { userId } = req.params;
      const {
        first_name,
        last_name,
        email,
        password_hash,
        role,
        updated_at,
      } = req.body;
      const updatedUser = await db.query(
        `
        UPDATE users
        SET 
          first_name = $2,
          last_name = $3,
          email = $4,
          password_hash = $5, 
          role = $6,
          updated_at = $7
        WHERE id = $1
        RETURNING *;
        `,
        [
          userId, // $1
          first_name, // $2
          last_name, // $3
          email, // $4
          password_hash, // $5
          role, // $6
          updated_at, // $7
        ],
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
        RETURNING id;
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
