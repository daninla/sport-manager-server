import pool from "../config/db.js";

export const getGroupsWithPlayers = async () => {
  try {
    const { rows: groups } = await pool.query(`
    SELECT
      g.*,
      (
        SELECT COALESCE(
          JSON_AGG(row_to_json(p)),
          '[]'::json
        )
        FROM group_players gp
        JOIN players p ON p.id = gp.player_id
        WHERE gp.group_id = g.id
      ) AS players
    FROM groups g
    ORDER BY g.id;
  `);

    return groups;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getGroupByIdRecord = async (id) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT
        g.*,
        (
          SELECT COALESCE(
            JSON_AGG(row_to_json(p)),
            '[]'::json
          )
          FROM group_players gp
          JOIN players p ON p.id = gp.player_id
          WHERE gp.group_id = g.id
        ) AS players
      FROM groups g
      WHERE g.id = $1;
   `,
      [id],
    );
    return rows[0] ?? null;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createGroupRecord = async ({
  name,
  tournament_id: tournamentId,
  capacity,
  player_ids: playerIds = [],
}) => {
  if (playerIds.length > capacity) {
    const err = new Error(
      `Group capacity is ${capacity}, but ${playerIds.length} players were provided`,
    );

    err.status = 400;
    throw err;
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `
        INSERT INTO groups (name, tournament_id, capacity)
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [name, tournamentId, capacity],
    );

    const group = rows[0];

    for (const playerId of playerIds) {
      await client.query(
        `
          INSERT INTO group_players (group_id, player_id)
          VALUES ($1, $2)
        `,
        [group.id, playerId],
      );
    }

    await client.query("COMMIT");
    return group.id;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const updateGroupRecord = async ({
  id,
  name,
  capacity,
  player_ids: playerIds,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `
        UPDATE groups
        SET name = $1,
        capacity = $2
        WHERE id = $3
        RETURNING *
      `,
      [name, capacity, id],
    );

    if (rows.length === 0) {
      const err = new Error("Группа не найдена");
      err.status = 404;
      throw err;
    }

    await client.query("DELETE FROM group_players WHERE group_id = $1", [id]);

    for (const playerId of playerIds) {
      await client.query(
        `
          INSERT INTO group_players (group_id, player_id)
          VALUES ($1, $2)
        `,
        [id, playerId],
      );
    }

    await client.query("COMMIT");

    return id;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const deleteGroupRecord = async (id) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const { rowCount } = await client.query(
      `
        DELETE FROM groups
        WHERE id = $1
      `,
      [id],
    );
    await client.query("DELETE FROM group_players WHERE group_id = $1", [id]);
    await client.query("COMMIT");
    return rowCount > 0;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
