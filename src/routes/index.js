import { Router } from "express";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import groupsRouter from "./groupsRouter.js";

const router = Router();

router.get("/admin/access", requireAdmin, (req, res) => res.json({ allowed: true }));
router.use("/groups", groupsRouter);

export default router;