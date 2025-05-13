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
    return this.repository.createWorkout(workoutData);
  }

  async getWorkoutById(id: number): Promise<Workout | null> {
    return this.repository.getWorkoutById(id);
  }

  async getAllWorkouts(): Promise<Workout[]> {
    return this.repository.getAllWorkouts();
  }

  async updateWorkout(id: number, workoutData: any): Promise<Workout> {
    try {
      return await this.repository.updateWorkout(id, workoutData);
    } catch (error) {
      console.error("Error in updateWorkout:", error);
      throw new Error("Workout update failed");
    }
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

  

  async getWorkoutStreak(userId: number): Promise<number> {
    return this.repository.getWorkoutStreak(userId);
  }

  async getPersonalBests(userId: number): Promise<{ exerciseId: number; maxWeight: number }[]> {
    return this.repository.getPersonalBests(userId);
  }

  async logWorkoutSession(
    userId: number,
    workoutId: number,
    date: Date,
    exercises?: { exerciseId: number; setsCompleted?: number; repsCompleted?: number; weightUsed?: number }[]
  ): Promise<WorkoutSession & { sessionExercises: SessionExercise[] }> {
    return this.repository.logWorkoutSession({
      userId,
      workoutId,
      date,
      exercises
    });
  }

  async getSessionById(sessionId: number, userId: number) {
    const session = await this.repository.getSessionById(sessionId);
    if (!session || session.userId !== userId) throw new Error("Unauthorized");
    return session;
  }

  async getUserBadge(userId: number): Promise<{
    totalSessions: number;
    badge: "Noob" | "Intermediate" | "Pro" | "Master";
  }> {
    
    const totalSessions = await this.repository.countSessionsByUserId(userId);
    let badge: "Noob" | "Intermediate" | "Pro" | "Master";

    if (totalSessions < 10) {
      badge = "Noob";
    } else if (totalSessions < 20) {
      badge = "Intermediate";
    } else if (totalSessions < 50) {
      badge = "Pro";
    } else {
      badge = "Master";
    }

    return { totalSessions, badge };
  }

  async updateSessionExercise(
    sessionExerciseId: number,
    userId: number,
    data: { weightUsed?: number; setsCompleted?: number; repsCompleted?: number }
  ): Promise<SessionExercise> {
    // Verify ownership
    const existing = await this.repository.findSessionExerciseById(sessionExerciseId);
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

  async toggleFavoriteWorkout(userId: number, workoutId: number): Promise<{ isFavorite: boolean }> {
    const existingFavorite = await this.repository.getFavoriteWorkout(userId, workoutId);
    
    if (existingFavorite) {
      await this.repository.removeFavoriteWorkout(userId, workoutId);
      return { isFavorite: false };
    } else {
      await this.repository.addFavoriteWorkout(userId, workoutId);
      return { isFavorite: true };
    }
  }

  async getFavoriteWorkouts(userId: number): Promise<Workout[]> {
    return this.repository.getFavoriteWorkouts(userId);
  }

  async getLogWorkoutSession(userId: number): Promise<WorkoutSession[]> {
    try {
      if (!userId || isNaN(userId)) {
        throw new Error('Invalid user ID');
      }

      console.log('Service: Fetching workout sessions for user:', userId);
      const sessions = await this.repository.getLogWorkoutSession(userId);
      
      if (!sessions) {
        throw new Error('No sessions found');
      }

      console.log(`Service: Found ${sessions.length} sessions`);
      return sessions;
    } catch (error) {
      console.error('Service error in getLogWorkoutSession:', error);
      throw error;
    }
  }

  async getMaxPrForExercise(userId: number, exerciseId: number): Promise<number> {
    return this.repository.getMaxPrForExercise(userId, exerciseId);
  }
}
