import db from '../config/db.js';

class Admin {
  async getAdmins(_, res, next) {
    try {
      const admins = await db.query(`
        SELECT u.id, u.first_name, u.last_name, u.email, u.created_at, u.updated_at
        FROM users u
        JOIN user_roles ur ON u.id = ur.user_id
        JOIN roles r ON ur.role_id = r.id
        WHERE r.title = 'admin'
        ORDER BY u.id;
      `);
      res.json(admins.rows);
    } catch (error) {
      next(error);
    }
  }

  async getAdminById(req, res, next) {
    try {
      const { adminId } = req.params;
      const admin = await db.query(
        `
          SELECT u.id, u.first_name, u.last_name, u.email, u.created_at, u.updated_at
          FROM users u
          JOIN user_roles ur ON u.id = ur.user_id
          JOIN roles r ON ur.role_id = r.id
          WHERE u.id = $1 AND r.title = 'admin';
        `,
        [adminId],
      );

      if (admin.rows.length) {
        res.json(admin.rows[0]);
      } else {
        res.status(404).send('Admin not found');
      }
    } catch (error) {
      next(error);
    }
  }

  async createAdmin(req, res, next) {
    try {
      const { user_id } = req.body;
      const createdAdmin = await db.query(
        `
          WITH assigned_role AS (
            INSERT INTO user_roles (user_id, role_id)
            SELECT $1, id
            FROM roles
            WHERE title = 'admin'
            ON CONFLICT (user_id, role_id) DO NOTHING
            RETURNING user_id
          )
          SELECT u.id, u.first_name, u.last_name, u.email, u.created_at, u.updated_at
          FROM users u
          JOIN user_roles ur ON u.id = ur.user_id
          JOIN roles r ON ur.role_id = r.id
          WHERE u.id = $1 AND r.title = 'admin';
        `,
        [user_id],
      );

      if (createdAdmin.rows.length) {
        res.status(201).json(createdAdmin.rows[0]);
      } else {
        res.status(404).send('User or admin role not found');
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteAdmin(req, res, next) {
    try {
      const { adminId } = req.params;
      const deletedAdmin = await db.query(
        `
          DELETE FROM user_roles ur
          USING roles r
          WHERE ur.role_id = r.id
            AND ur.user_id = $1
            AND r.title = 'admin'
          RETURNING ur.user_id;
        `,
        [adminId],
      );

      if (deletedAdmin.rows.length) {
        res.json(deletedAdmin.rows[0]);
      } else {
        res.status(404).send('Admin not found');
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new Admin();
