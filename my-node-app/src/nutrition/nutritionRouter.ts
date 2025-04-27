import { Router } from "express";
import { NutritionController } from "./nutritionController";
import { NutritionService } from "./nutritionService";
import { NutritionRepository } from "./nutritionRepository";
import { PrismaClient } from "@prisma/client";
import { authenticateJWT } from '../auth/JWT/authMiddleware';

const router = Router();
const prisma = new PrismaClient();
const repository = new NutritionRepository(prisma);
const service = new NutritionService(repository);
const controller = new NutritionController(service);

// Apply authentication middleware to all routes
router.use(authenticateJWT);

// Debug middleware to log user info
router.use((req, res, next) => {
  console.log("User from JWT:", req.user);
  next();
});

// Search foods using USDA API
router.get("/search", controller.searchFoods.bind(controller));

// Create a new nutrition log
router.post("/logs", controller.createNutritionLog.bind(controller));

// Get nutrition logs (with optional date filter)
router.get("/logs/:id", controller.getNutritionLogs.bind(controller));

// Delete a nutrition log
router.delete("/logs/:logId", controller.deleteNutritionLog.bind(controller));

export default router;
