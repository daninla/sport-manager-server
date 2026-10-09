import { Router } from "express";
import {
  getMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
} from "../controllers/matchesController.js";
import { matchSchema } from "../utils/schemas/matchSchema.js";
import { validate } from "../middlewares/index.js";

const matchesRouter = Router();

matchesRouter.route("/:id")
  .get(getMatchById)
  .patch(validate(matchSchema.partial()), updateMatch)
  .delete(deleteMatch);
matchesRouter.route("/")
  .get(getMatches)
  .post(validate(matchSchema), createMatch);

export default matchesRouter;