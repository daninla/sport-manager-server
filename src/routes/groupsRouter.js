import router from "express";
import {
  getGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  getAvailablePlayers,
  randomCreateGroup,
} from "../controllers/groupsController.js";
import { groupSchema, groupUpdateSchema } from "../utils/schemas/index.js";
import { validate } from "../middlewares/validation.mw.js";

const groupsRouter = router.Router();

groupsRouter.get("/", getGroups);
groupsRouter.get("/available-players", getAvailablePlayers);
groupsRouter.get("/:id", getGroupById);
groupsRouter.post("/", validate(groupSchema), createGroup);
groupsRouter.post("/random", randomCreateGroup);
groupsRouter.patch("/:id", validate(groupUpdateSchema), updateGroup);
groupsRouter.delete("/:id", deleteGroup);

export default groupsRouter;
