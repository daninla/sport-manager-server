import router from "express";
import {
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../controllers/groupsController.js";
import { groupSchema } from "../utils/schemas/index.js";
import { validate } from "../middlewares/validation.mw.js";

const groupsRouter = router.Router();

groupsRouter.get("/", getGroups);
groupsRouter.post("/", validate(groupSchema), createGroup);
groupsRouter.patch("/:id", validate(groupSchema), updateGroup);
groupsRouter.delete("/:id", deleteGroup);

export default groupsRouter;
  