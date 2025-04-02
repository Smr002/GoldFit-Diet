import { WorkoutModel } from './workoutModel';
import { WorkoutRepository } from './workoutRepository';
import { Exercise, Workout, WorkoutSession, SessionExercise } from '@prisma/client';
import { WorkoutSessionModel } from "./sessionModel";

export class WorkoutService {
  private repository: WorkoutRepository;

  constructor() {
    this.repository = new WorkoutRepository();
  }

  async createWorkout(workoutData: any): Promise<Workout> {
    const workout = new WorkoutModel(workoutData);
    if (!workout.isValid()) {
      throw new Error('Invalid workout data');
    }
    return this.repository.createWorkout(workout);
  }

  async getWorkoutById(id: number): Promise<Workout | null> {
    return this.repository.getWorkoutById(id);
  }

  async getAllWorkouts(): Promise<Workout[]> {
    return this.repository.getAllWorkouts();
  }

  async updateWorkout(id: number, workoutData: any): Promise<Workout> {
    const workout = new WorkoutModel(workoutData);
    if (!workout.isValid()) {
      throw new Error('Invalid workout data');
    }
    return this.repository.updateWorkout(id, workout);
  }

  async deleteWorkout(id: number): Promise<Workout> {
    return this.repository.deleteWorkout(id);
  }

  async getWorkoutsByCreator(creatorId: number, isAdmin: boolean = false): Promise<Workout[]> {
    return this.repository.getWorkoutsByCreator(creatorId, isAdmin);
  }

  async getActiveWorkoutsForUser(userId: number): Promise<Workout[]> {
    return this.repository.getActiveWorkoutsForUser(userId);
  }

  async searchExercises(query: string, muscleGroup?: string): Promise<Exercise[]> {
    return this.repository.searchExercises(query, muscleGroup);
  }

  async logWorkoutSession(userId: number, workoutId: number, date: Date): Promise<WorkoutSession> {
    const sessionModel = new WorkoutSessionModel({
      userId,
      workoutId,
      date
    });

    return this.repository.logWorkoutSession(sessionModel);
  }

  async getWorkoutStreak(userId: number): Promise<number> {
    return this.repository.getWorkoutStreak(userId);
  }

  async getPersonalBests(userId: number): Promise<{ exerciseId: number; maxWeight: number }[]> {
    return this.repository.getPersonalBests(userId);
  }

  async createWorkoutSession(
    userId: number,
    workoutId: number,
    date: Date,
    exercises: {
      exerciseId: number;
      weightUsed?: number;
      setsCompleted?: number;
      repsCompleted?: number;
    }[]
  ): Promise<WorkoutSession> {
    const sessionModel = new WorkoutSessionModel({
      userId,
      workoutId,
      date,
      exercises,
    });
    if (!sessionModel.isValid()) throw new Error("Invalid session data");
    return this.repository.logWorkoutSession(sessionModel);
  }

  async getSessionById(sessionId: number, userId: number) {
    const session = await this.repository.getSessionById(sessionId);
    if (!session || session.userId !== userId) throw new Error("Unauthorized");
    return session;
  }

  async updateSessionExercise(
    sessionExerciseId: number,
    userId: number,
    data: { weightUsed?: number; setsCompleted?: number; repsCompleted?: number }
  ): Promise<SessionExercise> {
    // Verify ownership
    const existing = await this.repository.prisma.sessionExercise.findUnique({
      where: { id: sessionExerciseId },
      include: { session: true },
    });
    if (!existing || existing.session.userId !== userId) throw new Error("Unauthorized");
    return this.repository.updateSessionExercise(sessionExerciseId, data);
  }

  async getUserSessionHistory(userId: number, limit?: number) {
    return this.repository.getSessionsByUserId(userId, limit);
  }

  // Additional business logic methods

  async createCustomWorkout(userId: number, workoutData: any): Promise<Workout> {
    workoutData.createdByUser = userId;
    return this.createWorkout(workoutData);
  }

  async getPreMadeWorkouts(): Promise<Workout[]> {
    const allWorkouts = await this.getAllWorkouts();
    return allWorkouts.filter(workout => workout.createdByAdmin !== null);
  }

  async getWorkoutProgress(userId: number, workoutId: number): Promise<{
    totalSessions: number;
    lastSession: Date | null;
    streak: number;
  }> {
    const sessions = await this.repository.getWorkoutSessions(userId, workoutId);
    const streak = await this.getWorkoutStreak(userId);

    return {
      totalSessions: sessions.length,
      lastSession: sessions[0]?.date || null,
      streak,
    };
  }

  async getWorkoutPerformance(userId: number, workoutId: number): Promise<{
    exerciseId: number;
    maxWeight: number;
    totalVolume: number;
    lastSession: Date | null;
  }[]> {
    const personalBests = await this.getPersonalBests(userId);
    const sessions = await this.repository.getWorkoutSessions(userId, workoutId);

    return personalBests.map(best => ({
      exerciseId: best.exerciseId,
      maxWeight: best.maxWeight,
      totalVolume: sessions.reduce((acc, session) => {
        const exercise = session.sessionExercises.find(e => e.exerciseId === best.exerciseId);
        return acc + (exercise?.weightUsed || 0) * (exercise?.setsCompleted || 0) * (exercise?.repsCompleted || 0);
      }, 0),
      lastSession: sessions[0]?.date || null,
    }));
  }
}
