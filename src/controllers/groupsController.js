import pool from "../config/db.js";

export const getGroups = async (req, res, next) => {
  try {
    const result = await pool.query(`SELECT * FROM groups`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const createGroup = async (req, res, next) => {
  try {
    const { name, tournament_id, capacity } = req.body;
    const result = await pool.query(
      `INSERT INTO groups (name, tournament_id, capacity) VALUES ($1, $2, $3) RETURNING *`,
      [name, tournament_id, capacity],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body ?? {};
    const fields = ["name", "tournament_id", "capacity"];
    const updates = fields.filter((field) => Object.hasOwn(data, field));

    if (updates.length === 0) {
      return res.status(400).send("No fields to update");
    }

    const values = updates.map((field) => data[field]);
    values.push(id);
    const setClause = updates
      .map((field, index) => `${field} = $${index + 1}`)
      .join(", ");
    const result = await pool.query(
      `UPDATE groups SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values,
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Group not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deleteGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM groups WHERE id = $1 RETURNING *`,
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Group not found");
    }
    res.json({ message: "Group deleted successfully" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
