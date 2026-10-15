import pool from "../../config/db.js";
import { camelizeKeys } from "./camelize.js";

export const createGroupRecord = async ({
  name,
  tournamentId,
  capacity,
  playerIds = [],
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
    return camelizeKeys(group);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

///////////////////////////////////////////////////////

const getGroupForUpdate = async (client, id) => {
  const { rows } = await client.query(
    "SELECT capacity FROM groups WHERE id = $1 FOR UPDATE",
    [id],
  );

  if (rows.length === 0) {
    const err = new Error("Группа не найдена");
    err.status = 404;
    throw err;
  }

  return rows[0];
};

const getGroupPlayerCount = async (client, id) => {
  const { rows } = await client.query(
    "SELECT COUNT(*)::int AS count FROM group_players WHERE group_id = $1",
    [id],
  );

  return rows[0].count;
};

const validateGroupCapacity = (capacity, playerCount) => {
  if (capacity < playerCount) {
    const err = new Error(
      `Group capacity is ${capacity}, but ${playerCount} players are assigned`,
    );
    err.status = 400;
    throw err;
  }
};

const updateGroupFields = async (client, id, { name, capacity }) => {
  const fields = [];
  const values = [];

  if (name !== undefined) {
    values.push(name);
    fields.push(`name = $${values.length}`);
  }

  if (capacity !== undefined) {
    values.push(capacity);
    fields.push(`capacity = $${values.length}`);
  }

  if (fields.length === 0) return;

  values.push(id);
  await client.query(
    `UPDATE groups SET ${fields.join(", ")} WHERE id = $${values.length}`,
    values,
  );
};

const replaceGroupPlayers = async (client, id, playerIds) => {
  await client.query("DELETE FROM group_players WHERE group_id = $1", [id]);

  if (playerIds.length > 0) {
    await client.query(
      `
        INSERT INTO group_players (group_id, player_id)
        SELECT $1, unnest($2::bigint[])
      `,
      [id, playerIds],
    );
  }
};

export const updateGroupRecord = async ({ id, name, capacity, playerIds }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const group = await getGroupForUpdate(client, id);

    if (playerIds !== undefined && !Array.isArray(playerIds)) {
      const err = new Error("playerIds должен быть массивом");
      err.status = 400;
      throw err;
    }

    const playerCount =
      playerIds === undefined
        ? await getGroupPlayerCount(client, id)
        : playerIds.length;
    const nextCapacity = capacity === undefined ? group.capacity : capacity;

    validateGroupCapacity(nextCapacity, playerCount);
    await updateGroupFields(client, id, { name, capacity });

    if (playerIds !== undefined) {
      await replaceGroupPlayers(client, id, playerIds);
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

////////////////////////////////////////////////

export const deleteGroupRecord = async (id) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM group_players WHERE group_id = $1", [id]);

    const { rows } = await client.query(
      "DELETE FROM groups WHERE id = $1 RETURNING id",
      [id],
    );

    await client.query("COMMIT");
    return rows.length > 0;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
