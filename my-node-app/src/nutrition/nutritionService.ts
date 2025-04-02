import { NutritionRepository } from "./nutritionRepository";
import { NutritionLog, FoodSearchResult } from "./nutritionModel";

export class NutritionService {
  private repository: NutritionRepository;
  private readonly USDA_API_KEY = "Q0OdBuGbK6sKKOj7YhXNN7ECmpVig2YL7za67Ge8";
  private readonly USDA_API_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";

  constructor(repository: NutritionRepository) {
    this.repository = repository;
  }

  async searchFoods(query: string): Promise<FoodSearchResult[]> {
    try {
      const response = await fetch(
        `${this.USDA_API_URL}?api_key=${this.USDA_API_KEY}&query=${encodeURIComponent(query)}&dataType=Foundation,SR%20Legacy`
      );

      if (!response.ok) {
        throw new Error(`USDA API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.foods.slice(0, 10).map((food: any) => ({
        fdcId: food.fdcId,
        description: food.description,
        foodNutrients: food.foodNutrients.map((nutrient: any) => ({
          nutrientName: nutrient.nutrientName,
          value: nutrient.value,
          unitName: nutrient.unitName,
        })),
      }));
    } catch (error) {
      console.error("Error searching foods:", error);
      throw new Error("Failed to search foods");
    }
  }

  async createNutritionLog(log: NutritionLog) {
    return this.repository.createNutritionLog(log);
  }

  async getNutritionLogsByUserId(userId: number) {
    return this.repository.getNutritionLogsByUserId(userId);
  }

  async getNutritionLogsByDate(userId: number, date: Date) {
    return this.repository.getNutritionLogsByDate(userId, date);
  }

  async deleteNutritionLog(logId: number) {
    return this.repository.deleteNutritionLog(logId);
  }

  calculateNutrients(foodItems: any[]) {
    return foodItems.reduce(
      (acc, item) => ({
        totalCalories: acc.totalCalories + item.calories,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fats: acc.fats + item.fats,
      }),
      { totalCalories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  }
}
