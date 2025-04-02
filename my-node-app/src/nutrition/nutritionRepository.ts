import { PrismaClient } from "@prisma/client";
import { NutritionLog } from "./nutritionModel";

export class NutritionRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createNutritionLog(log: NutritionLog) {
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
  }

  async getNutritionLogsByUserId(userId: number) {
    return this.prisma.nutritionLog.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async getNutritionLogsByDate(userId: number, date: Date) {
    return this.prisma.nutritionLog.findMany({
      where: {
        userId: userId,
        date: date,
      },
    });
  }

  async deleteNutritionLog(logId: number) {
    return this.prisma.nutritionLog.delete({
      where: {
        id: logId,
      },
    });
  }
}
