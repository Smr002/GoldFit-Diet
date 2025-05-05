import { Request, Response } from "express";
import { WeeklySummaryService } from "./weeklySummaryService";
import { AuthenticatedRequest } from "../auth/JWT/authMiddleware";

export class WeeklySummaryController {
  private service: WeeklySummaryService;

  constructor() {
    this.service = new WeeklySummaryService();  // Verify this is working
  }
  
  async getWeeklySummary(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = Number(req.user?.id);
      
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }
      
      // Use req as a standard Express request for query parameters
      const weekStartParam = (req as unknown as Request).query.weekStart;
      const weekStart = Array.isArray(weekStartParam) ? weekStartParam[0] : weekStartParam;

      // Validate weekStart date format if provided
      if (weekStart && typeof weekStart === 'string') {
        const date = new Date(weekStart);
        if (isNaN(date.getTime())) {
          res.status(400).json({ error: "Invalid date format for weekStart. Use YYYY-MM-DD." });
          return;
        }
      }
      
      const summary = await this.service.getWeeklySummary(
        userId,
        weekStart ? String(weekStart) : undefined
      );

      // Transform data for the frontend
      const frontendData = {
        calories: {
          daily: summary.dailySummaries.map(day => day.calorieIntake),
          goal: summary.dailySummaries[0]?.calorieGoal || 2000,
          average: summary.averageDailyCalories
        },
        workouts: {
          completed: summary.totalWorkoutSessions,
          duration: summary.totalWorkoutMinutes,
          caloriesBurned: summary.totalCaloriesBurned,
          types: summary.workoutTypeDistribution.map(item => ({
            name: item.type,
            value: item.count
          }))
        },
        nutrition: {
          averages: {
            protein: summary.averageProtein,
            carbs: summary.averageCarbs,
            fat: summary.averageFats
          },
          waterIntake: summary.averageHydration
        }
      };
      
      res.json(frontendData);
    } catch (error) {
      console.error("Error fetching weekly summary:", error);
      res.status(500).json({
        error: "Failed to fetch weekly summary",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
}

export const weeklySummaryController = new WeeklySummaryController();