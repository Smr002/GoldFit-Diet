import { z } from "zod";

// Exercise schema for workout exercises
export const WorkoutExerciseSchema = z.object({
  id: z.number().optional(),
  exerciseId: z.number(),
  dayOfTheWeek: z.number().optional().nullable(),
  sets: z.number().min(1, { message: "Sets must be at least 1." }),
  reps: z.number().min(1, { message: "Reps must be at least 1." }),
});

// Main Workout schema
export const WorkoutSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Workout name cannot be empty." }),
  level: z.string().optional().nullable(),
  timesPerWeek: z.number().optional().nullable(),
  premium: z.boolean().optional().default(false),
  createdByAdmin: z.number().optional().nullable(),
  createdByUser: z.number().optional().nullable(),
  exercises: z.array(WorkoutExerciseSchema),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Workout = z.infer<typeof WorkoutSchema>;
export type WorkoutExercise = z.infer<typeof WorkoutExerciseSchema>;

export class WorkoutModel {
  private data: Workout;

  constructor(options: Partial<Workout>) {
    this.data = WorkoutSchema.parse({
      ...options,
      name: options.name?.trim() || "",
      level: options.level?.trim() || undefined,
      exercises: options.exercises || [],
      createdAt: options.createdAt ?? new Date(),
      updatedAt: options.updatedAt ?? new Date(),
    });
  }

  toObject(): Workout {
    return this.data;
  }

  isValid(): boolean {
    try {
      WorkoutSchema.parse(this.data);
      return true;
    } catch (error) {
      console.error("Validation failed:", error);
      return false;
    }
  }

  // Helper methods for managing exercises
  addExercise(exercise: WorkoutExercise): void {
    this.data.exercises.push(exercise);
    this.data.updatedAt = new Date();
  }

  removeExercise(exerciseId: number): void {
    this.data.exercises = this.data.exercises.filter(ex => ex.exerciseId !== exerciseId);
    this.data.updatedAt = new Date();
  }

  updateExercise(exerciseId: number, updates: Partial<WorkoutExercise>): void {
    this.data.exercises = this.data.exercises.map(ex => 
      ex.exerciseId === exerciseId ? { ...ex, ...updates } : ex
    );
    this.data.updatedAt = new Date();
  }

  // Helper methods for workout properties
  setName(name: string): void {
    this.data.name = name.trim();
    this.data.updatedAt = new Date();
  }

  setLevel(level: string): void {
    this.data.level = level.trim();
    this.data.updatedAt = new Date();
  }

  setTimesPerWeek(times: number): void {
    this.data.timesPerWeek = times;
    this.data.updatedAt = new Date();
  }

  setPremium(isPremium: boolean): void {
    this.data.premium = isPremium;
    this.data.updatedAt = new Date();
  }

  // Getter methods
  getExercises(): WorkoutExercise[] {
    return this.data.exercises;
  }

  getExercisesByDay(dayOfTheWeek: number): WorkoutExercise[] {
    return this.data.exercises.filter(ex => ex.dayOfTheWeek === dayOfTheWeek);
  }

  getExerciseById(exerciseId: number): WorkoutExercise | undefined {
    return this.data.exercises.find(ex => ex.exerciseId === exerciseId);
  }
} 