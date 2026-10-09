import { Router } from "express";
import matchesRouter from "./matchRouter.js";

const router = new Router();
router.use("/matches",matchesRouter)

export default router;