import mongoose from 'mongoose';

// Define the Workout Schema
const workoutSchema = new mongoose.Schema(
  {
    workoutName: { type: String, required: true },
    workoutLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
      default: 'Beginner',
    },
    timesPerWeek: { type: Number, enum: [3, 4, 5, 6], required: true },
    exercises: [
      {
        exerciseId: { type: String, required: true },
        sets: { type: Number, required: true },
        reps: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt fields
);

// Create the Workout model
const Workout = mongoose.model('Workout', workoutSchema);

export default Workout; // Use ES module syntax
