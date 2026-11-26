import { Router } from "express";
import torunamentRouter from "./tournamentRouter.js";
import playerRouter from "./playerRouter.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import groupsRouter from "./groupsRouter.js";

const router = Router();

router.use("/tournaments", torunamentRouter);
router.use("/players", playerRouter);
router.get("/admin/access", requireAdmin, (req, res) =>
  res.json({ allowed: true }),
);
router.use("/groups", groupsRouter);

export default router;
