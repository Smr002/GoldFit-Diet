import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true, default: () => uuidv4() },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },

    firstName: { type: String },
    lastName: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female'] },
    weight: { type: Number },
    height: { type: Number },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] }, // Fixed missing bracket
    goal: { type: String, enum: ['Weight Loss', 'Muscle Gain', 'Maintenance'] },

    // Workout Plans and Tracking
    customWorkouts: [
      {
        exerciseName: { type: String, required: true },
        exerciseId: { type: String, required: true },
        sets: { type: Number, required: true },
        reps: { type: Number, required: true },
      },
    ],
    workoutReminders: { type: Boolean, default: true },
    personalBests: [
      {
        exerciseId: { type: String, required: true },
        exerciseName: { type: String, required: true },
        maxWeight: { type: Number },
        maxReps: { type: Number },
      },
    ],
    streaks: { type: Number, default: 0 },
    progressCharts: [
      {
        date: { type: Date },
        weightLifted: { type: Number },
        repsCompleted: { type: Number },
      },
    ],

    // Rewards and Gamification
    points: { type: Number, default: 0 },
    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
    motivationalNotifications: { type: Boolean, default: true },

    // Admin Tools
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

// Create and export the User model
const User = mongoose.model('User', userSchema);

export default User; // Use ES module syntax
