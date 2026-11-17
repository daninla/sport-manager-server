import { Router } from "express";
import torunamentRouter from './tournamentRouter.js';
import playerRouter from './playerRouter.js';
import groupsRouter from "./groupsRouter.js";

const router = Router();

router.use('/tournaments', torunamentRouter);
router.use('/players', playerRouter);
router.use("/groups", groupsRouter);

export default router;
