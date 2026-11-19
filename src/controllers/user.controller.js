import db from '../config/db.js';
import bcrypt from 'bcrypt';

class User {
  async getUsers(_, res, next) {
    try {
      const users = await db.query(`
        SELECT
          u.id,
          u.first_name,
          u.last_name,
          u.email,
          u.created_at,
          u.updated_at,
          COALESCE(
            ARRAY_AGG(r.title) FILTER (WHERE r.title IS NOT NULL),
            '{}'
          ) AS roles
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        GROUP BY u.id
        ORDER BY u.id;
      `);
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
          SELECT
            u.id,
            u.first_name,
            u.last_name,
            u.email,
            u.created_at,
            u.updated_at,
            COALESCE(
              ARRAY_AGG(r.title) FILTER (WHERE r.title IS NOT NULL),
              '{}'
            ) AS roles
          FROM users u
          LEFT JOIN user_roles ur ON u.id = ur.user_id
          LEFT JOIN roles r ON ur.role_id = r.id
          WHERE u.id = $1
          GROUP BY u.id;
        `,
        [userId],
      );

      if (user.rows.length) {
        res.json(user.rows[0]);
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const { email, password, first_name, last_name } = req.body;
      const password_hash = await bcrypt.hash(password, 10);

      const createdUser = await db.query(
        `
          INSERT INTO users (email, password_hash, first_name, last_name)
          VALUES ($1, $2, $3, $4)
          RETURNING id, email, first_name, last_name, created_at, updated_at;
        `,
        [email, password_hash, first_name, last_name],
      );
      res.status(201).json(createdUser.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { userId } = req.params;
      const { email, password, first_name, last_name } = req.body;
      const password_hash = password ? await bcrypt.hash(password, 10) : null;

      const updatedUser = await db.query(
        `
          UPDATE users
          SET
            email = COALESCE($2, email),
            password_hash = COALESCE($3, password_hash),
            first_name = COALESCE($4, first_name),
            last_name = COALESCE($5, last_name),
            updated_at = now()
          WHERE id = $1
          RETURNING id, email, first_name, last_name, created_at, updated_at;
        `,
        [userId, email, password_hash, first_name, last_name],
      );

      if (updatedUser.rows.length) {
        res.json(updatedUser.rows[0]);
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { userId } = req.params;
      const { password } = req.body;

      if (!password) {
        return res.status(400).send('Password is required');
      }

      const user = await db.query(
        `
        SELECT password_hash
        FROM users
        WHERE id = $1;
      `,
        [userId],
      );

      if (!user.rows.length) {
        return res.status(404).send('User not found');
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.rows[0].password_hash,
      );

      if (!isPasswordValid) {
        return res.status(401).send('Invalid email or password');
      }

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
