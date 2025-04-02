import { PrismaClient, Workout, WorkoutExercise, WorkoutSession, Exercise, SessionExercise } from '@prisma/client';
import { WorkoutModel } from './workoutModel';
import { WorkoutSessionModel } from './sessionModel';

export class WorkoutRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createWorkout(workout: WorkoutModel): Promise<Workout> {
    const workoutData = workout.toObject();
    return this.prisma.workout.create({
      data: {
        name: workoutData.name,
        level: workoutData.level,
        timesPerWeek: workoutData.timesPerWeek,
        premium: workoutData.premium,
        createdByAdmin: workoutData.createdByAdmin,
        createdByUser: workoutData.createdByUser,
        workoutExercises: {
          create: workoutData.exercises.map(exercise => ({
            exerciseId: exercise.exerciseId,
            dayOfTheWeek: exercise.dayOfTheWeek,
            sets: exercise.sets,
            reps: exercise.reps,
          })),
        },
      },
      include: {
        workoutExercises: {
          include: {
            exercise: true,
          },
        },
      },
    });
  }

  async getWorkoutById(id: number): Promise<Workout | null> {
    return this.prisma.workout.findUnique({
      where: { id },
      include: {
        workoutExercises: {
          include: {
            exercise: true,
          },
        },
        adminCreator: true,
        userCreator: true,
        favoriteWorkouts: true,
        workoutSessions: true,
        activeForUsers: true,
      },
    });
  }

  async getAllWorkouts(): Promise<Workout[]> {
    return this.prisma.workout.findMany({
      include: {
        workoutExercises: {
          include: {
            exercise: true,
          },
        },
        adminCreator: true,
        userCreator: true,
      },
    });
  }

  async updateWorkout(id: number, workout: WorkoutModel): Promise<Workout> {
    const workoutData = workout.toObject();
    return this.prisma.workout.update({
      where: { id },
      data: {
        name: workoutData.name,
        level: workoutData.level,
        timesPerWeek: workoutData.timesPerWeek,
        premium: workoutData.premium,
        workoutExercises: {
          deleteMany: {},
          create: workoutData.exercises.map(exercise => ({
            exerciseId: exercise.exerciseId,
            dayOfTheWeek: exercise.dayOfTheWeek,
            sets: exercise.sets,
            reps: exercise.reps,
          })),
        },
      },
      include: {
        workoutExercises: {
          include: {
            exercise: true,
          },
        },
      },
    });
  }

  async deleteWorkout(id: number): Promise<Workout> {
    // First delete all related workout exercises
    await this.prisma.workoutExercise.deleteMany({
      where: {
        workoutId: id
      }
    });

    // Then delete the workout
    return this.prisma.workout.delete({
      where: { id },
    });
  }

  async getWorkoutsByCreator(creatorId: number, isAdmin: boolean = false): Promise<Workout[]> {
    return this.prisma.workout.findMany({
      where: isAdmin 
        ? { createdByAdmin: creatorId }
        : { createdByUser: creatorId },
      include: {
        workoutExercises: {
          include: {
            exercise: true,
          },
        },
      },
    });
  }

  async getActiveWorkoutsForUser(userId: number): Promise<Workout[]> {
    return this.prisma.workout.findMany({
      where: {
        activeForUsers: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        workoutExercises: {
          include: {
            exercise: true,
          },
        },
      },
    });
  }

  async searchExercises(query: string, muscleGroup?: string): Promise<Exercise[]> {
    return this.prisma.exercise.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { muscleGroup: { contains: query, mode: 'insensitive' } },
        ],
        ...(muscleGroup && { muscleGroup }),
      },
    });
  }

  async logWorkoutSession(
    sessionModel: WorkoutSessionModel
  ): Promise<WorkoutSession & { sessionExercises: SessionExercise[] }> {
    const sessionData = sessionModel.toObject();
    const { exercises = [], userId, workoutId, date } = sessionData;

    // Create the main session
    const createdSession = await this.prisma.workoutSession.create({
      data: {
        userId,
        workoutId,
        date,
      },
    });

    // Create associated session-exercises
    if (exercises.length) {
      await this.prisma.sessionExercise.createMany({
        data: exercises.map((ex) => ({
          sessionId: createdSession.id,
          exerciseId: ex.exerciseId,
          weightUsed: ex.weightUsed || null,
          setsCompleted: ex.setsCompleted || null,
          repsCompleted: ex.repsCompleted || null,
        })),
      });
    }

    return this.prisma.workoutSession.findUnique({
      where: { id: createdSession.id },
      include: {
        sessionExercises: {
          include: { exercise: true },
        },
      },
    }) as Promise<WorkoutSession & { sessionExercises: SessionExercise[] }>;
  }

  async getSessionById(
    sessionId: number
  ): Promise<WorkoutSession & { sessionExercises: SessionExercise[] } | null> {
    return this.prisma.workoutSession.findUnique({
      where: { id: sessionId },
      include: {
        sessionExercises: {
          include: { exercise: true },
        },
      },
    });
  }

  async updateSessionExercise(
    sessionExerciseId: number,
    data: { weightUsed?: number; setsCompleted?: number; repsCompleted?: number }
  ): Promise<SessionExercise> {
    return this.prisma.sessionExercise.update({
      where: { id: sessionExerciseId },
      data,
      include: { exercise: true },
    });
  }

  async getSessionsByUserId(
    userId: number,
    limit?: number
  ): Promise<(WorkoutSession & { sessionExercises: SessionExercise[] })[]> {
    return this.prisma.workoutSession.findMany({
      where: { userId },
      include: {
        sessionExercises: {
          include: { exercise: true },
        },
      },
      orderBy: { date: "desc" },
      take: limit,
    });
  }

  async getWorkoutStreak(userId: number): Promise<number> {
    const sessions = await this.prisma.workoutSession.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of sessions) {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);

      if (currentDate.getTime() - sessionDate.getTime() === 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  async getPersonalBests(userId: number): Promise<{ exerciseId: number; maxWeight: number }[]> {
    const results = await this.prisma.sessionExercise.groupBy({
      by: ['exerciseId'],
      where: {
        session: {
          userId,
        },
      },
      _max: {
        weightUsed: true,
      },
    });

    return results.map(result => ({
      exerciseId: result.exerciseId,
      maxWeight: result._max.weightUsed || 0,
    }));
  }

  async getWorkoutSessions(userId: number, workoutId: number): Promise<(WorkoutSession & { sessionExercises: { exerciseId: number; weightUsed: number | null; setsCompleted: number | null; repsCompleted: number | null }[] })[]> {
    return this.prisma.workoutSession.findMany({
      where: {
        userId,
        workoutId,
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        sessionExercises: {
          include: {
            exercise: true
          }
        }
      },
    });
  }
}
