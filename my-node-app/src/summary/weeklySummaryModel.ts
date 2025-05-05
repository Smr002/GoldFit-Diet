import { z } from "zod";

// Daily summary schema
export const DailySummarySchema = z.object({
  date: z.date(),
  calorieIntake: z.number().default(0),
  calorieGoal: z.number().default(0),
  protein: z.number().default(0),
  carbs: z.number().default(0),
  fats: z.number().default(0),
  hydration: z.number().default(0),
  workoutMinutes: z.number().default(0),
  caloriesBurned: z.number().default(0),
  workoutCompleted: z.boolean().default(false),
});

// Workout type distribution schema
export const WorkoutTypeDistributionSchema = z.object({
  type: z.string(),
  count: z.number(),
  minutes: z.number(),
});

// Weekly summary schema
export const WeeklySummarySchema = z.object({
  userId: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  dailySummaries: z.array(DailySummarySchema),
  totalCaloriesConsumed: z.number(),
  averageDailyCalories: z.number(),
  totalWorkoutSessions: z.number(),
  totalWorkoutMinutes: z.number(),
  totalCaloriesBurned: z.number(),
  workoutTypeDistribution: z.array(WorkoutTypeDistributionSchema),
  averageProtein: z.number(),
  averageCarbs: z.number(),
  averageFats: z.number(),
  averageHydration: z.number(),
});

export type DailySummary = z.infer<typeof DailySummarySchema>;
export type WorkoutTypeDistribution = z.infer<typeof WorkoutTypeDistributionSchema>;
export type WeeklySummary = z.infer<typeof WeeklySummarySchema>;