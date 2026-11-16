import db from "../../database/models/index.js";
import {
  getAvailablePlayerIds,
  getGroupByIdRecord,
} from "./groupsReadService.js";

const { Group, GroupPlayer, sequelize } = db;

const validateGroupCapacity = (capacity, playerCount, description) => {
  if (playerCount > capacity) {
    const err = new Error(
      `Group capacity is ${capacity}, but ${playerCount} players ${description}`,
    );
    err.status = 400;
    throw err;
  }
};

const addGroupPlayers = async (groupId, playerIds, transaction) => {
  if (playerIds.length === 0) return;

  await GroupPlayer.bulkCreate(
    playerIds.map((playerId) => ({ groupId, playerId })),
    { transaction },
  );
};

const createGroupWithPlayers = async (
  { name, tournamentId, capacity, playerIds },
  transaction,
) => {
  const group = await Group.create(
    { name, tournamentId, capacity },
    { transaction },
  );
  await addGroupPlayers(group.id, playerIds, transaction);
  return group;
};

export const createGroupRecord = ({
  name,
  tournamentId,
  capacity,
  playerIds = [],
}) => {
  validateGroupCapacity(capacity, playerIds.length, "were provided");

  return sequelize.transaction((transaction) =>
    createGroupWithPlayers(
      { name, tournamentId, capacity, playerIds },
      transaction,
    ),
  );
};

export const updateGroupRecord = ({ id, name, capacity, playerIds }) =>
  sequelize.transaction(async (transaction) => {
    const group = await Group.findByPk(id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!group) {
      const err = new Error("Группа не найдена");
      err.status = 404;
      throw err;
    }

    if (playerIds !== undefined && !Array.isArray(playerIds)) {
      const err = new Error("playerIds должен быть массивом");
      err.status = 400;
      throw err;
    }

    const playerCount =
      playerIds === undefined
        ? await GroupPlayer.count({ where: { groupId: id }, transaction })
        : playerIds.length;

    validateGroupCapacity(
      capacity === undefined ? group.capacity : capacity,
      playerCount,
      "are assigned",
    );
    await group.update({ name, capacity }, { transaction });

    if (playerIds !== undefined) {
      await GroupPlayer.destroy({ where: { groupId: id }, transaction });
      await addGroupPlayers(id, playerIds, transaction);
    }

    return getGroupByIdRecord(id, transaction);
  });

export const deleteGroupRecord = (id) =>
  sequelize.transaction(async (transaction) => {
    const group = await Group.findByPk(id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!group) return false;

    await GroupPlayer.destroy({ where: { groupId: id }, transaction });
    await group.destroy({ transaction });
    return true;
  });

const shuffle = (items) => {
  for (let index = items.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [items[index], items[other]] = [items[other], items[index]];
  }
};

export const randomCreateGroupRecord = ({ tournamentId, capacity }) =>
  sequelize.transaction(async (transaction) => {
    const playerIds = await getAvailablePlayerIds(tournamentId, {
      transaction,
    });

    if (playerIds.length === 0) {
      const err = new Error("Нет доступных игроков для создания группы");
      err.status = 400;
      throw err;
    }

    const groupSize = Number(capacity);
    if (!Number.isInteger(groupSize) || groupSize <= 0) {
      const err = new Error("Capacity must be a positive integer");
      err.status = 400;
      throw err;
    }

    shuffle(playerIds);

    const createdGroups = [];

    for (let offset = 0; offset < playerIds.length; offset += groupSize) {
      const group = await createGroupWithPlayers(
        {
          name: String.fromCharCode(65 + createdGroups.length),
          tournamentId,
          capacity: groupSize,
          playerIds: playerIds.slice(offset, offset + groupSize),
        },
        transaction,
      );

      createdGroups.push(group);
    }

    return createdGroups;
  });
