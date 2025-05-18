import { z } from "zod";

// Schema for food search results from USDA API
export const FoodNutrientSchema = z.object({
  nutrientName: z.string(),
  value: z.number(),
  unitName: z.string(),
});

export const FoodSearchResultSchema = z.object({
  fdcId: z.number(),
  description: z.string(),
  foodNutrients: z.array(FoodNutrientSchema),
});

// Schema for nutrition log entry
export const NutritionLogSchema = z.object({
  userId: z.number(),
  date: z.date(),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]),
  totalCalories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fats: z.number().min(0),
  hydration: z.number().min(0),
  foodItems: z.array(z.object({
    fdcId: z.number(),
    description: z.string(),
    servingSize: z.number(),
    unit: z.string(),
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fats: z.number(),
  })),
  name: z.string().optional(),
});

export type FoodNutrient = z.infer<typeof FoodNutrientSchema>;
export type FoodSearchResult = z.infer<typeof FoodSearchResultSchema>;
export type NutritionLog = z.infer<typeof NutritionLogSchema>;
