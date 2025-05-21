import { PrismaClient, Workout, WorkoutExercise, WorkoutSession, Exercise, SessionExercise, FavoriteWorkout } from '@prisma/client';

interface CreateWorkoutData {
  name: string;
  level?: string | null;
  timesPerWeek?: number | null;
  premium?: boolean;
  createdByAdmin?: number | null;
  createdByUser?: number | null;
  workoutExercises?: Array<{
    exerciseId: number;
    dayOfTheWeek?: number;
    sets: number;
    reps: number;
  }>;
  exercises?: Array<{
    exerciseId: number;
    dayOfTheWeek?: number;
    sets: number;
    reps: number;
  }>;
}

interface UpdateWorkoutData {
  name: string;
  level?: string | null;
  timesPerWeek?: number | null;
  premium?: boolean;
  workoutExercises?: Array<{
    exerciseId: number;
    dayOfTheWeek?: number;
    sets: number;
    reps: number;
  }>;
  exercises?: Array<{
    exerciseId: number;
    dayOfTheWeek?: number;
    sets: number;
    reps: number;
  }>;
}

export class WorkoutRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createWorkout(workoutData: CreateWorkoutData): Promise<Workout> {
    const exercises = workoutData.workoutExercises || workoutData.exercises || [];
    console.log('Received workout data:', workoutData); // Debug log

    return this.prisma.workout.create({
      data: {
        name: workoutData.name,
        level: workoutData.level,
        timesPerWeek: workoutData.timesPerWeek,
        premium: workoutData.premium ?? false,
        createdByAdmin: workoutData.createdByAdmin,
        createdByUser: workoutData.createdByUser,
        workoutExercises: {
          create: exercises.map(exercise => ({
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

  async getWorkoutCount(): Promise<number> {
    console.log(this.prisma.workout.count());
    console.log('Workout count:', await this.prisma.workout.count());
    return this.prisma.workout.count();
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

  async updateWorkout(id: number, workoutData: UpdateWorkoutData): Promise<Workout> {
    const exercises = workoutData.workoutExercises || workoutData.exercises || [];
    console.log('Updating workout with data:', workoutData); // Debug log

    return this.prisma.workout.update({
      where: { id },
      data: {
        name: workoutData.name,
        level: workoutData.level,
        timesPerWeek: workoutData.timesPerWeek,
        premium: workoutData.premium,
        workoutExercises: {
          deleteMany: {},
          create: exercises.map(exercise => ({
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
    sessionData: {
      userId: number;
      workoutId: number;
      date: Date;
      exercises?: {
        exerciseId: number;
        weightUsed?: number;
        setsCompleted?: number;
        repsCompleted?: number;
      }[];
    }
  ): Promise<WorkoutSession & { sessionExercises: SessionExercise[] }> {
    const { exercises = [], userId, workoutId, date } = sessionData;

    // Create the main session
    const createdSession = await this.prisma.workoutSession.create({
      data: {
        userId,
        workoutId,
        date,
      },
    });

    if (exercises.length) {
      for (const exercise of exercises) {
        // Skip if no weight was used
        if (!exercise.weightUsed) {
          await this.prisma.sessionExercise.create({
            data: {
              sessionId: createdSession.id,
              exerciseId: exercise.exerciseId,
              weightUsed: exercise.weightUsed || null,
              setsCompleted: exercise.setsCompleted || null,
              repsCompleted: exercise.repsCompleted || null,
            }
          });
          continue;
        }

        // Get current max PR for this user and exercise
        const currentMaxPR = await this.getMaxPrForExercise(userId, exercise.exerciseId);
        
        // Create the session exercise with updated max PR if needed
        await this.prisma.sessionExercise.create({
          data: {
            sessionId: createdSession.id,
            exerciseId: exercise.exerciseId,
            weightUsed: exercise.weightUsed,
            setsCompleted: exercise.setsCompleted || null,
            repsCompleted: exercise.repsCompleted || null,
            maxPr: exercise.weightUsed > currentMaxPR ? exercise.weightUsed : currentMaxPR,
          }
        });
      }
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
    data: { weightUsed?: number; setsCompleted?: number; repsCompleted?: number; maxPr?: number }
  ): Promise<SessionExercise> {
    // If weight is being updated, we need to check for PR
    if (data.weightUsed) {
      const currentExercise = await this.prisma.sessionExercise.findUnique({
        where: { id: sessionExerciseId },
        include: { session: true, exercise: true },
      });
      
      if (currentExercise) {
        const currentMaxPR = await this.getMaxPrForExercise(
          currentExercise.session.userId, 
          currentExercise.exerciseId
        );
        
        // Update max_pr if the new weight is higher
        if (data.weightUsed > currentMaxPR) {
          data.maxPr = data.weightUsed;
        }
      }
    }

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
      select: { date: true },
    });
  
    // extract just the dates (midnight)
    const dates = sessions.map(s => {
      const d = new Date(s.date);
      d.setHours(0,0,0,0);
      return d.getTime();
    });
  
    let streak = 0;
    let expected = new Date();
    expected.setHours(0,0,0,0);
  
    let restUsed = false;
  
    for (const ts of dates) {
      const diffDays = (expected.getTime() - ts) / (1000*60*60*24);
  
      if (diffDays === 0) {
        // worked out today
        streak++;
        expected.setDate(expected.getDate() - 1);
  
      } else if (diffDays === 1 && !restUsed) {
        // one rest day allowed
        restUsed = true;
        // _do_ count this workout as continuation
        streak++;
        // move expected to day before this workout
        expected = new Date(ts);
        expected.setDate(expected.getDate() - 1);
  
      } else {
        break;
      }
    }
  
    return streak;
  }

  async getPersonalBests(userId: number): Promise<{ exerciseId: number; name: string; maxWeight: number }[]> {
    const agg = await this.prisma.sessionExercise.groupBy({
      by: ['exerciseId'],
      where: { session: { userId } },
      _max: { weightUsed: true },
    });

    const ids = agg.map(r => r.exerciseId);
    const exercises = await this.prisma.exercise.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true },
    });

    return agg.map(r => ({
      exerciseId: r.exerciseId,
      name: exercises.find(e => e.id === r.exerciseId)?.name ?? 'Unknown',
      maxWeight: r._max.weightUsed ?? 0,
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

  async countSessionsByUserId(userId: number): Promise<number> {  
    return this.prisma.workoutSession.count({
      where: { userId },
    });
  }

  async getFavoriteWorkout(userId: number, workoutId: number): Promise<FavoriteWorkout | null> {
    return this.prisma.favoriteWorkout.findFirst({
      where: {
        userId,
        workoutId
      }
    });
  }

  async addFavoriteWorkout(userId: number, workoutId: number): Promise<FavoriteWorkout> {
    return this.prisma.favoriteWorkout.create({
      data: {
        userId,
        workoutId
      }
    });
  }

  async removeFavoriteWorkout(userId: number, workoutId: number): Promise<void> {
    await this.prisma.favoriteWorkout.deleteMany({
      where: {
        userId,
        workoutId
      }
    });
  }

  async getFavoriteWorkouts(userId: number): Promise<Workout[]> {
    return this.prisma.workout.findMany({
      where: {
        favoriteWorkouts: {
          some: {
            userId
          }
        }
      },
      include: {
        workoutExercises: {
          include: {
            exercise: true
          }
        }
      }
    });
  }

  async findSessionExerciseById(id: number) {
    return this.prisma.sessionExercise.findUnique({
      where: { id },
      include: { session: true }
    });
  }

  async getLogWorkoutSession(userId: number): Promise<WorkoutSession[]> {
    try {
      console.log('Repository: Fetching sessions for userId:', userId);
      
      const sessions = await this.prisma.workoutSession.findMany({
        where: { userId },
        include: {
          workout: {
            include: {
              workoutExercises: {
                include: {
                  exercise: true
                }
              }
            }
          },
          sessionExercises: {
            include: {
              exercise: true
            }
          },
          user: {
            select: {
              id: true,
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      });

      console.log(`Repository: Found ${sessions.length} sessions`);
      return sessions;
    } catch (error) {
      console.error('Repository error in getLogWorkoutSession:', error);
      throw new Error(`Failed to fetch workout sessions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getMaxPrForExercise(userId: number, exerciseId: number): Promise<number> {
    // First try to get the latest max_pr value for this exercise
    const latestExerciseWithMaxPr = await this.prisma.sessionExercise.findFirst({
      where: {
        exerciseId,
        session: {
          userId,
        },
        maxPr: {
          not: null,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        maxPr: true,
      },
    });

    if (latestExerciseWithMaxPr?.maxPr) {
      return latestExerciseWithMaxPr.maxPr;
    }

    // Fall back to calculating it if no max_pr is stored
    const result = await this.prisma.sessionExercise.aggregate({
      where: {
        exerciseId,
        session: {
          userId,
        },
        weightUsed: {
          not: null,
        },
      },
      _max: {
        weightUsed: true,
      },
    });

    return result._max.weightUsed ?? 0;
  }

  async getWeeklyProgressSessions(userId: number, fromDate: Date) {
    return this.prisma.workoutSession.findMany({
      where: {
        userId,
        date: { gte: fromDate },
      },
      include: {
        sessionExercises: true, // pulls in exerciseId, weightUsed, setsCompleted, repsCompleted
      },
    });
  }
  
  async getAllSessionExercises(userId: number): Promise<
    (SessionExercise & { session: { date: Date }; exercise: { name: string } })[]
  > {
    return this.prisma.sessionExercise.findMany({
      where: { session: { userId } },
      include: {
        session: { select: { date: true } },
        exercise: { select: { name: true } },
      },
      orderBy: {
        session: { date: 'desc' },
      },
    });
  }

  
  async getSessionExercisesByExercise(
    userId: number,
    exerciseId: number,
    limit: number
  ): Promise<(SessionExercise & { session: { date: Date } })[]> {
    return this.prisma.sessionExercise.findMany({
      where: {
        exerciseId,
        session: { userId },
      },
      include: {
        session: { select: { date: true } },
      },
      orderBy: {
        session: { date: 'desc' },
      },
      take: limit,
    });
  }
}
