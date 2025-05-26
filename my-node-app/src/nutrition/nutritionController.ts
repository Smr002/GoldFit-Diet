import { Request, Response } from "express";
import { NutritionService } from "./nutritionService";
import { NutritionLogSchema } from "./nutritionModel";

export class NutritionController {
  private service: NutritionService;

  constructor(service: NutritionService) {
    this.service = service;
  }

  async searchFoods(req: Request, res: Response) {
    try {
      const { query } = req.query;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Query parameter is required" });
      }

      const foods = await this.service.searchFoods(query);
      res.json(foods);
    } catch (error) {
      console.error("Error in searchFoods:", error);
      res.status(500).json({ error: "Failed to search foods" });
    }
  }

  async createNutritionLog(req: Request, res: Response) {
    try {

      
      // Convert date string to Date object if it's a string
      const body = {
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : new Date(),
        userId: req.user?.id,
      };
      
 
      
      const logData = NutritionLogSchema.parse(body);

      
      const log = await this.service.createNutritionLog(logData);
      res.status(201).json(log);
    } catch (error) {
    
      res.status(400).json({ 
        error: "Invalid nutrition log data",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  async getNutritionLogs(req: Request, res: Response) {
    try {
      const userId = req.user?.id; // Assuming user is attached by auth middleware
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { date } = req.query;
      let logs;

      if (date) {
        logs = await this.service.getNutritionLogsByDate(userId, new Date(date as string));
       
      } else {
        logs = await this.service.getNutritionLogsByDate(userId,new Date());
      }

      res.json(logs);
    } catch (error) {
      console.error("Error in getNutritionLogs:", error);
      res.status(500).json({ error: "Failed to get nutrition logs" });
    }
  }

  async deleteNutritionLog(req: Request, res: Response) {
    try {
      const { logId } = req.params;
      const userId = req.user?.id; // Assuming user is attached by auth middleware

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await this.service.deleteNutritionLog(parseInt(logId));
      res.status(204).send();
    } catch (error) {
      console.error("Error in deleteNutritionLog:", error);
      res.status(500).json({ error: "Failed to delete nutrition log" });
    }
  }
}
