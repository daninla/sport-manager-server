import pool from "../../config/db.js";
import { camelizeKeys } from "./camelize.js";

export const getGroupsWithPlayers = async (tournamentId) => {
  try {
    const { rows: groups } = await pool.query(
      `
        SELECT
          g.*,
          (
            SELECT COALESCE(JSON_AGG(row_to_json(p)), '[]'::json)
            FROM group_players gp
            JOIN players p ON p.id = gp.player_id
            WHERE gp.group_id = g.id
          ) AS players
        FROM groups g
        WHERE g.tournament_id = $1
        ORDER BY g.id;
      `,
      [tournamentId],
    );

    return camelizeKeys(groups);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
//////////////////////////////////////////////////////

export const getGroupByIdRecord = async (id) => {
  try {
    const { rows } = await pool.query(
      `
        SELECT
          g.*,
          (
            SELECT COALESCE(JSON_AGG(row_to_json(p)), '[]'::json)
            FROM group_players gp
            JOIN players p ON p.id = gp.player_id
            WHERE gp.group_id = g.id
          ) AS players
        FROM groups g
        WHERE g.id = $1;
      `,
      [id],
    );

    return rows[0] ? camelizeKeys(rows[0]) : null;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
////////////////////////////////////////

const getUnassignedPlayers = async (tournamentId) => {
  const { rows } = await pool.query(
    `
      SELECT DISTINCT p.*
      FROM players p
      JOIN registrations r ON r.player_id = p.id
      WHERE r.tournament_id = $1
        AND NOT EXISTS (
          SELECT 1
          FROM group_players gp
          JOIN groups g ON g.id = gp.group_id
          WHERE gp.player_id = p.id
            AND g.tournament_id = $1
        )
      ORDER BY p.id
    `,
    [tournamentId],
  );

  return camelizeKeys(rows);
};

const getPlayersAvailableForGroup = async (tournamentId, groupId) => {
  const { rows } = await pool.query(
    `
      SELECT DISTINCT p.*
      FROM players p
      JOIN registrations r ON r.player_id = p.id
      WHERE r.tournament_id = $1
        AND EXISTS (
          SELECT 1
          FROM groups target_group
          WHERE target_group.id = $2
            AND target_group.tournament_id = $1
        )
        AND NOT EXISTS (
          SELECT 1
          FROM group_players gp
          JOIN groups g ON g.id = gp.group_id
          WHERE gp.player_id = p.id
            AND g.tournament_id = $1
            AND gp.group_id <> $2
        )
      ORDER BY p.id
    `,
    [tournamentId, groupId],
  );

  return camelizeKeys(rows);
};

export const getUnassignedTournamentPlayers = (tournamentId, groupId) =>
  groupId == null
    ? getUnassignedPlayers(tournamentId)
    : getPlayersAvailableForGroup(tournamentId, groupId);
