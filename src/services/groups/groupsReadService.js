import { Op } from "sequelize";
import db from "../../../database/models/index.js";

const { Group, GroupPlayer, Player, Registration } = db;

const includePlayers = {
  association: "players",
  through: { attributes: [] },
};

export const getGroupsWithPlayers = (tournamentId) =>
  Group.findAll({
    where: { tournamentId },
    include: [includePlayers],
    order: [["id", "ASC"]],
  });

export const getGroupByIdRecord = (id, transaction) =>
  Group.findByPk(id, {
    include: [includePlayers],
    transaction,
  });

export const getAvailablePlayerIds = async (tournamentId, { groupId, transaction } = {}) => {
  if (tournamentId == null) return [];

  const registrations = await Registration.findAll({
    attributes: ["playerId"],
    where: { tournamentId },
    raw: true,
    transaction,
  });
  const playerIds = [...new Set(registrations.map(({ playerId }) => playerId))];
  if (playerIds.length === 0) return [];

  const memberships = await GroupPlayer.findAll({
    attributes: ["playerId"],
    where: {
      playerId: { [Op.in]: playerIds },
      ...(groupId == null ? {} : { groupId: { [Op.ne]: groupId } }),
    },
    include: [{
      association: "group",
      attributes: [],
      required: true,
      where: { tournamentId },
    }],
    raw: true,
    transaction,
  });
  const assignedIds = new Set(memberships.map(({ playerId }) => playerId));

  return playerIds.filter((playerId) => !assignedIds.has(playerId));
};

export const getUnassignedTournamentPlayers = async (tournamentId, groupId) => {
  if (tournamentId == null) return [];

  if (groupId != null) {
    const group = await Group.findOne({
      attributes: ["id"],
      where: { id: groupId, tournamentId },
    });
    if (!group) return [];
  }

  const playerIds = await getAvailablePlayerIds(tournamentId, { groupId });
  if (playerIds.length === 0) return [];

  return Player.findAll({
    where: { id: { [Op.in]: playerIds } },
    order: [["id", "ASC"]],
  });
};
