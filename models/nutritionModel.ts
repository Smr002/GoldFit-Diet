import mongoose from 'mongoose';

// Define the Nutrition Schema
const nutritionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Daily Calorie Goal
    dailyCaloriesGoal: { type: Number, required: true },

    // Tracked Calories
    trackedCalories: [
      {
        date: { type: Date, required: true },
        caloriesConsumed: { type: Number, required: true },
      },
    ],

    // Tracked Macros (Protein, Carbs, Fats)
    trackedMacros: [
      {
        date: { type: Date, required: true },
        protein: { type: Number, required: true },
        carbs: { type: Number, required: true },
        fats: { type: Number, required: true },
      },
    ],

    // Hydration Logs
    hydrationLogs: [
      {
        date: { type: Date, required: true },
        litersConsumed: { type: Number, required: true },
      },
    ],

    // Logged Foods
    loggedFoods: [
      {
        date: { type: Date, required: true },
        fdcId: { type: Number, required: true },
        description: { type: String, required: true },
        calories: { type: Number, required: true }, // Store food calorie value
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt fields
);

// Create and export the Nutrition model
const Nutrition = mongoose.model('Nutrition', nutritionSchema);

export default Nutrition; // Use ES module syntax
