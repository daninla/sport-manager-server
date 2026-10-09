import pool from "../config/db.js";

const MATCH_FIELDS = [
  "tournament_id",
  "stage",
  "group_id",
  "round",
  "player1_id",
  "player2_id",
  "winner_id",
  "status",
  "starts_at",
  "table_number",
  "duration_seconds",
  "sets",
  "current_set",
  "bracket_id",
  "bracket_position",
];

export const getMatches = async (req, res, next) => {
  try {
    const result = await pool.query(`SELECT * FROM matches ORDER BY id ASC`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getMatchById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM matches WHERE id = $1`, [
      id,
    ]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Match not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const createMatch = async (req, res, next) => {
  try {
    const data = req.body;
    const keys = MATCH_FIELDS.filter((f) => Object.hasOwn(data, f));

    if (keys.length === 0) {
      return res
        .status(400)
        .json({
          error: "Bad Request",
          message: "No fields provided to insert",
        });
    }

    const values = keys.map((f) => data[f]);
    const columns = keys.join(", ");
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

    const result = await pool.query(
      `INSERT INTO matches (${columns}) VALUES (${placeholders}) RETURNING *`,
      values,
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateMatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body ?? {};
    const updates = MATCH_FIELDS.filter((field) => Object.hasOwn(data, field));

    if (updates.length === 0) {
      return res
        .status(400)
        .json({ error: "Bad Request", message: "No fields to update" });
    }

    const values = updates.map((field) => {
      if (
        (field === "sets" || field === "current_set") &&
        typeof data[field] === "object" &&
        data[field] !== null
      ) {
        return JSON.stringify(data[field]);
      }
      return data[field];
    });
    values.push(id);

    const setClause = updates
      .map((field, index) => `${field} = $${index + 1}`)
      .join(", ");

    const result = await pool.query(
      `UPDATE matches SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values,
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Match not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deleteMatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM matches WHERE id = $1 RETURNING *`,
      [id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Match not found" });
    }

    res.json({ message: "Match deleted successfully" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
