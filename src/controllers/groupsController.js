import {
  getGroupsWithPlayers,
  getGroupByIdRecord,
  createGroupRecord,
  updateGroupRecord,
  deleteGroupRecord,
  getUnassignedTournamentPlayers,
  randomCreateGroupRecord,
} from "../services/groupsService.js";

export const getGroups = async (req, res, next) => {
  try {
    const { tournamentId } = req.query;

    if (!tournamentId) {
      return res.status(400).json({ message: "tournamentId обязателен" });
    }

    const groups = await getGroupsWithPlayers(tournamentId);
    res.json(groups);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getGroupById = async (req, res, next) => {
  try {
    const group = await getGroupByIdRecord(req.params.id);
    if (!group) {
      return res.status(404).send("Group not found");
    }
    res.json(group);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const createGroup = async (req, res, next) => {
  try {
    const group = await createGroupRecord(req.body);
    res.json(group);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateGroup = async (req, res, next) => {
  try {
    const group = await updateGroupRecord({ ...req.body, id: req.params.id });
    if (!group) {
      return res.status(404).send("Group not found");
    }
    res.json(group);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deleteGroup = async (req, res, next) => {
  try {
    const deleted = await deleteGroupRecord(req.params.id);
    if (!deleted) {
      return res.status(404).send("Group not found");
    }
    res.json({ message: "Group deleted successfully" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAvailablePlayers = async (req, res, next) => {
  try {
    const { tournamentId, groupId } = req.query;

    const players = await getUnassignedTournamentPlayers(tournamentId, groupId);

    res.set("Cache-Control", "no-store");
    res.status(200).json(players);
  } catch (err) {
    next(err);
  }
};

export const randomCreateGroup = async (req, res, next) => {
  try {
    const group = await randomCreateGroupRecord(req.body);
    res.json(group);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
