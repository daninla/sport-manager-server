import { requireAdmin } from "../middlewares/requireAdmin.js";
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
groupsRouter.get("/available-players", requireAdmin, getAvailablePlayers);
groupsRouter.get("/:id", getGroupById);
groupsRouter.post("/", requireAdmin, validate(groupSchema), createGroup);
groupsRouter.post("/random", requireAdmin, randomCreateGroup);
groupsRouter.patch("/:id", requireAdmin, validate(groupUpdateSchema), updateGroup);
groupsRouter.delete("/:id", requireAdmin, deleteGroup);

export default groupsRouter;
