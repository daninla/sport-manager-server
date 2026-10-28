import { Router } from "express";
import groupsRouter from "./groupsRouter.js";

const router = Router();

router.use("/groups", groupsRouter);

export default router;