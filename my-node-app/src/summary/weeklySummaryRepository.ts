import { PrismaClient } from "@prisma/client";
import { WeeklySummary, DailySummary, WorkoutTypeDistribution } from "./weeklySummaryModel";

const prisma = new PrismaClient();

export class WeeklySummaryRepository {
  async getWeeklySummary(userId: number, startDate: Date, endDate: Date): Promise<WeeklySummary> {
    // Get user information once
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        weight: true,
        nutritionGoal: true 
      },
    });

    // Get user's nutrition logs for the week
    const nutritionLogs = await prisma.nutritionLog.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // Get user's workout sessions for the week
    const workoutSessions = await prisma.workoutSession.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        workout: {
          select: {
            name: true,
            level: true
          }
        },
        sessionExercises: true
      },
      orderBy: {
        date: "asc",
      },
    });

    // Create daily summaries
    const dailySummaries: DailySummary[] = this.generateDailySummaries(
      startDate,
      endDate,
      nutritionLogs,
      workoutSessions,
      user?.nutritionGoal || 2000  
    );

    // Calculate aggregate statistics
    const totalCaloriesConsumed = dailySummaries.reduce(
      (sum, day) => sum + day.calorieIntake, 0
    );
    
    const averageDailyCalories = dailySummaries.length > 0 ? 
      totalCaloriesConsumed / dailySummaries.length : 0;
    
    const totalWorkoutSessions = workoutSessions.length;
    
    const totalWorkoutMinutes = dailySummaries.reduce(
      (sum, day) => sum + day.workoutMinutes, 0
    );
    
    const totalCaloriesBurned = dailySummaries.reduce(
      (sum, day) => sum + day.caloriesBurned, 0
    );
    
    // Calculate workout type distribution
    const workoutTypeDistribution = this.calculateWorkoutTypeDistribution(workoutSessions);
    
    // Calculate average macronutrient intake
    const averageProtein = dailySummaries.length > 0 ? 
      dailySummaries.reduce((sum, day) => sum + day.protein, 0) / dailySummaries.length : 0;
    
    const averageCarbs = dailySummaries.length > 0 ? 
      dailySummaries.reduce((sum, day) => sum + day.carbs, 0) / dailySummaries.length : 0;
    
    const averageFats = dailySummaries.length > 0 ? 
      dailySummaries.reduce((sum, day) => sum + day.fats, 0) / dailySummaries.length : 0;
    
    const averageHydration = dailySummaries.length > 0 ? 
      dailySummaries.reduce((sum, day) => sum + day.hydration, 0) / dailySummaries.length : 0;
    
    return {
      userId,
      startDate,
      endDate,
      dailySummaries,
      totalCaloriesConsumed,
      averageDailyCalories,
      totalWorkoutSessions,
      totalWorkoutMinutes,
      totalCaloriesBurned,
      workoutTypeDistribution,
      averageProtein,
      averageCarbs,
      averageFats,
      averageHydration
    };
  }

  private generateDailySummaries(
    startDate: Date,
    endDate: Date,
    nutritionLogs: any[],
    workoutSessions: any[],
    userCalorieGoal: number
  ): DailySummary[] {
    const dailySummaries: DailySummary[] = [];
    const currentDate = new Date(startDate);
    const endDateTime = new Date(endDate).getTime();
    
    // Generate a summary for each day in the date range
    while (currentDate.getTime() <= endDateTime) {
      const date = new Date(currentDate);
      const dateString = date.toISOString().split('T')[0];
      
      // Find nutrition logs for this date
      const dayNutritionLogs = nutritionLogs.filter(
        log => new Date(log.date).toISOString().split('T')[0] === dateString
      );
      
      // Find workout sessions for this date
      const dayWorkoutSessions = workoutSessions.filter(
        session => new Date(session.date).toISOString().split('T')[0] === dateString
      );
      
      // Calculate daily calories consumed
      const calorieIntake = dayNutritionLogs.reduce(
        (sum, log) => sum + (log.totalCalories || 0), 0
      );
      
      // Calculate daily macros
      const protein = dayNutritionLogs.reduce(
        (sum, log) => sum + (log.protein || 0), 0
      );
      
      const carbs = dayNutritionLogs.reduce(
        (sum, log) => sum + (log.carbs || 0), 0
      );
      
      const fats = dayNutritionLogs.reduce(
        (sum, log) => sum + (log.fats || 0), 0
      );
      
      const hydration = dayNutritionLogs.reduce(
        (sum, log) => sum + (log.hydration || 0), 0
      );
      
      // Calculate workout minutes and calories burned
      const workoutMinutes = dayWorkoutSessions.reduce(
        (sum, session) => {
          const sessionDuration = session.sessionExercises.length * 5; // Estimate: 5 minutes per exercise
          return sum + sessionDuration;
        }, 0
      );
      
      const caloriesBurned = workoutMinutes * 5; // Simple estimation: 5 calories per minute
      const workoutCompleted = dayWorkoutSessions.length > 0;
      
      dailySummaries.push({
        date,
        calorieIntake,
        calorieGoal: userCalorieGoal,
        protein,
        carbs,
        fats,
        hydration,
        workoutMinutes,
        caloriesBurned,
        workoutCompleted
      });
      
      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dailySummaries;
  }

  private calculateWorkoutTypeDistribution(workoutSessions: any[]): WorkoutTypeDistribution[] {
    const typeStats = new Map<string, { count: number; minutes: number }>();

    workoutSessions.forEach(session => {
        const workoutType = session.workout?.name || 'No Type';
        const sessionMinutes = (session.sessionExercises?.length || 0) * 5; // 5 minutes per exercise

        const current = typeStats.get(workoutType) || { count: 0, minutes: 0 };
        typeStats.set(workoutType, {
            count: current.count + 1,
            minutes: current.minutes + sessionMinutes
        });
    });

    return Array.from(typeStats.entries()).map(([type, stats]) => ({
        type,
        count: stats.count,
        minutes: stats.minutes
    }));
  }
}