import { z } from "zod";

export const SessionExerciseSchema = z.object({
  id: z.number().optional(),
  sessionId: z.number().optional(),
  exerciseId: z.number(),
  weightUsed: z.number().optional().nullable(),
  setsCompleted: z.number().optional().nullable(),
  repsCompleted: z.number().optional().nullable(),
  createdAt: z.date().optional(),
});

export const WorkoutSessionSchema = z.object({
  id: z.number().optional(),
  userId: z.number(),
  workoutId: z.number(),
  date: z.date(),
  createdAt: z.date().optional(),
  exercises: z.array(SessionExerciseSchema).optional(),
});

export type SessionExercise = z.infer<typeof SessionExerciseSchema>;
export type WorkoutSession = z.infer<typeof WorkoutSessionSchema>;

export class WorkoutSessionModel {
  private data: WorkoutSession;

  constructor(init: Partial<WorkoutSession>) {
    this.data = {
      userId: init.userId || 0,
      workoutId: init.workoutId || 0,
      date: init.date || new Date(),
      exercises: init.exercises || [],
      createdAt: init.createdAt || new Date(),
    };
  }

  toObject(): WorkoutSession {
    return this.data;
  }

  isValid(): boolean {
    try {
      WorkoutSessionSchema.parse(this.data);
      return true;
    } catch {
      return false;
    }
  }

  addExercise(ex: SessionExercise): void {
    if (!this.data.exercises) {
      this.data.exercises = [];
    }
    this.data.exercises.push(ex);
  }
}