import express from "express";
import { weeklySummaryController } from "./weeklySummaryController";
import { authenticateJWT } from "../auth/JWT/authMiddleware";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateJWT);

// Get weekly summary
router.get("/", weeklySummaryController.getWeeklySummary.bind(weeklySummaryController));

export default router;