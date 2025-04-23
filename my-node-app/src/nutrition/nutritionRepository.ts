import { PrismaClient } from "@prisma/client";
import { NutritionLog } from "./nutritionModel";

export class NutritionRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createNutritionLog(log: NutritionLog) {
    try {
      return this.prisma.nutritionLog.create({
        data: {
          userId: log.userId,
          date: log.date,
          mealType: log.mealType,
          totalCalories: log.totalCalories,
          protein: log.protein,
          carbs: log.carbs,
          fats: log.fats,
          hydration: log.hydration,
        },
      });
    } catch (error) {
      console.error("Error creating nutrition log:", error);
      throw error; 
    }
  }

  async getNutritionLogsByUserId(userId: number) {
    try {
      return this.prisma.nutritionLog.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          date: 'desc',
        },
      });
    } catch (error) {
      console.error(`Error fetching nutrition logs for user ${userId}:`, error);
      throw error; 
    }
  }

  getNutritionLogById(logId: number){
    try {
      return this.prisma.nutritionLog.findUnique({
        where: {
          id: logId,
        },
      });
    } catch (error) {
      console.error(`Error fetching nutrition log with id ${logId}:`, error);
      throw error; 
    }
  }

  async getNutritionLogsByDate(userId: number, date: Date) {
    try {
      return this.prisma.nutritionLog.findMany({
        where: {
          userId: userId,
          date: date,
        },
      });
    } catch (error) {
      console.error(`Error fetching nutrition logs for user ${userId} on date ${date}:`, error);
      throw error; 
    }
  }

  async deleteNutritionLog(logId: number) {
    try {
      return this.prisma.nutritionLog.delete({
        where: {
          id: logId,
        },
      });
    } catch (error) {
      console.error(`Error deleting nutrition log with ID ${logId}:`, error);
      throw error; 
    }
  }
}