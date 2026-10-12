import {
  getGroupsWithPlayers,
  getGroupByIdRecord,
  createGroupRecord,
  updateGroupRecord,
  deleteGroupRecord,
} from "../services/groupsService.js";

export const getGroups = async (req, res, next) => {
  try {
    const groups = await getGroupsWithPlayers();
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
    const group = await updateGroupRecord(req.body);
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
