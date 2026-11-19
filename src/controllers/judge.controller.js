import db from '../config/db.js';

class Judge {
  async getJudges(_, res, next) {
    try {
      const judges = await db.query(`
        SELECT u.id, u.first_name, u.last_name, u.email, u.created_at, u.updated_at
        FROM users u
        JOIN user_roles ur ON u.id = ur.user_id
        JOIN roles r ON ur.role_id = r.id
        WHERE r.title = 'judge'
        ORDER BY u.id;
      `);
      res.json(judges.rows);
    } catch (error) {
      next(error);
    }
  }

  async getJudgeById(req, res, next) {
    try {
      const { judgeId } = req.params;
      const judge = await db.query(
        `
          SELECT u.id, u.first_name, u.last_name, u.email, u.created_at, u.updated_at
          FROM users u
          JOIN user_roles ur ON u.id = ur.user_id
          JOIN roles r ON ur.role_id = r.id
          WHERE u.id = $1 AND r.title = 'judge';
        `,
        [judgeId],
      );

      if (judge.rows.length) {
        res.json(judge.rows[0]);
      } else {
        res.status(404).send('Judge not found');
      }
    } catch (error) {
      next(error);
    }
  }

  async createJudge(req, res, next) {
    try {
      const { user_id } = req.body;
      const createdJudge = await db.query(
        `
          WITH assigned_role AS (
            INSERT INTO user_roles (user_id, role_id)
            SELECT $1, id
            FROM roles
            WHERE title = 'judge'
            ON CONFLICT (user_id, role_id) DO NOTHING
            RETURNING user_id
          )
          SELECT u.id, u.first_name, u.last_name, u.email, u.created_at, u.updated_at
          FROM users u
          JOIN user_roles ur ON u.id = ur.user_id
          JOIN roles r ON ur.role_id = r.id
          WHERE u.id = $1 AND r.title = 'judge';
        `,
        [user_id],
      );

      if (createdJudge.rows.length) {
        res.status(201).json(createdJudge.rows[0]);
      } else {
        res.status(404).send('User or judge role not found');
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteJudge(req, res, next) {
    try {
      const { judgeId } = req.params;
      const deletedJudge = await db.query(
        `
          DELETE FROM user_roles ur
          USING roles r
          WHERE ur.role_id = r.id
            AND ur.user_id = $1
            AND r.title = 'judge'
          RETURNING ur.user_id;
        `,
        [judgeId],
      );

      if (deletedJudge.rows.length) {
        res.json(deletedJudge.rows[0]);
      } else {
        res.status(404).send('Judge not found');
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new Judge();
