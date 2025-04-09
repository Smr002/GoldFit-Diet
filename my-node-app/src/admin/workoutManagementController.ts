import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all workouts with pagination and filtering
export const getAllWorkouts = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', search = '', filter = '' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause based on search and filter
    let whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { level: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (filter === 'premium') {
      whereClause.premium = true;
    } else if (filter === 'admin') {
      whereClause.createdByAdmin = { not: null };
    }

    // Get workouts with pagination
    const workouts = await prisma.workout.findMany({
      where: whereClause,
      include: {
        adminCreator: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        userCreator: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        workoutExercises: {
          include: {
            exercise: true
          }
        },
        _count: {
          select: {
            favoriteWorkouts: true,
            workoutSessions: true
          }
        }
      },
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' }
    });

    // Format workouts for response
    const formattedWorkouts = workouts.map(workout => ({
      id: workout.id,
      name: workout.name,
      level: workout.level,
      timesPerWeek: workout.timesPerWeek,
      premium: workout.premium,
      createdBy: workout.adminCreator 
        ? `${workout.adminCreator.user.firstName} ${workout.adminCreator.user.lastName} (Admin)` 
        : workout.userCreator 
          ? `${workout.userCreator.firstName} ${workout.userCreator.lastName} (User)` 
          : 'System',
      createdAt: workout.createdAt,
      exerciseCount: workout.workoutExercises.length,
      favoriteCount: workout._count.favoriteWorkouts,
      sessionCount: workout._count.workoutSessions
    }));

    // Get total count for pagination
    const totalWorkouts = await prisma.workout.count({ where: whereClause });

    res.json({
      workouts: formattedWorkouts,
      pagination: {
        total: totalWorkouts,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalWorkouts / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
};

// Get workout by ID
export const getWorkoutById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const workout = await prisma.workout.findUnique({
      where: { id: parseInt(id) },
      include: {
        adminCreator: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        userCreator: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        workoutExercises: {
          include: {
            exercise: true
          }
        }
      }
    });

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    // Format workout for response
    const formattedWorkout = {
      id: workout.id,
      name: workout.name,
      level: workout.level,
      timesPerWeek: workout.timesPerWeek,
      premium: workout.premium,
      createdBy: workout.adminCreator 
        ? `${workout.adminCreator.user.firstName} ${workout.adminCreator.user.lastName} (Admin)` 
        : workout.userCreator 
          ? `${workout.userCreator.firstName} ${workout.userCreator.lastName} (User)` 
          : 'System',
      createdAt: workout.createdAt,
      exercises: workout.workoutExercises.map(we => ({
        id: we.id,
        exerciseId: we.exerciseId,
        name: we.exercise.name,
        muscleGroup: we.exercise.muscleGroup,
        dayOfTheWeek: we.dayOfTheWeek,
        sets: we.sets,
        reps: we.reps
      }))
    };

    res.json(formattedWorkout);
  } catch (error) {
    console.error('Error fetching workout:', error);
    res.status(500).json({ error: 'Failed to fetch workout' });
  }
};

// Create a new workout
export const createWorkout = async (req: Request, res: Response) => {
  try {
    const { name, level, timesPerWeek, premium, exercises } = req.body;
    const adminId = req.user?.adminId; // Assuming adminId is available in the request after authentication

    if (!adminId) {
      return res.status(403).json({ error: 'Only admins can create workouts' });
    }

    // Create workout
    const newWorkout = await prisma.workout.create({
      data: {
        name,
        level,
        timesPerWeek: timesPerWeek ? parseInt(timesPerWeek) : null,
        premium: premium === true || premium === 'true',
        createdByAdmin: adminId
      }
    });

    // Add exercises to workout if provided
    if (exercises && Array.isArray(exercises) && exercises.length > 0) {
      const workoutExercises = exercises.map((exercise: any) => ({
        exerciseId: parseInt(exercise.exerciseId),
        workoutId: newWorkout.id,
        dayOfTheWeek: exercise.dayOfTheWeek ? parseInt(exercise.dayOfTheWeek) : null,
        sets: parseInt(exercise.sets),
        reps: parseInt(exercise.reps)
      }));

      await prisma.workoutExercise.createMany({
        data: workoutExercises
      });
    }

    res.status(201).json({
      id: newWorkout.id,
      name: newWorkout.name,
      message: 'Workout created successfully'
    });
  } catch (error) {
    console.error('Error creating workout:', error);
    res.status(500).json({ error: 'Failed to create workout' });
  }
};

// Update a workout
export const updateWorkout = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, level, timesPerWeek, premium, exercises } = req.body;

    // Build update data
    const updateData: any = {};
    
    if (name) updateData.name = name;
    if (level !== undefined) updateData.level = level;
    if (timesPerWeek !== undefined) updateData.timesPerWeek = timesPerWeek ? parseInt(timesPerWeek) : null;
    if (premium !== undefined) updateData.premium = premium === true || premium === 'true';

    // Update workout
    const updatedWorkout = await prisma.workout.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    // Update exercises if provided
    if (exercises && Array.isArray(exercises)) {
      // Delete existing workout exercises
      await prisma.workoutExercise.deleteMany({
        where: { workoutId: parseInt(id) }
      });

      // Create new workout exercises
      const workoutExercises = exercises.map((exercise: any) => ({
        exerciseId: parseInt(exercise.exerciseId),
        workoutId: parseInt(id),
        dayOfTheWeek: exercise.dayOfTheWeek ? parseInt(exercise.dayOfTheWeek) : null,
        sets: parseInt(exercise.sets),
        reps: parseInt(exercise.reps)
      }));

      await prisma.workoutExercise.createMany({
        data: workoutExercises
      });
    }

    res.json({
      id: updatedWorkout.id,
      name: updatedWorkout.name,
      message: 'Workout updated successfully'
    });
  } catch (error) {
    console.error('Error updating workout:', error);
    res.status(500).json({ error: 'Failed to update workout' });
  }
};

// Delete a workout
export const deleteWorkout = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Delete workout exercises first
    await prisma.workoutExercise.deleteMany({
      where: { workoutId: parseInt(id) }
    });

    // Delete workout
    await prisma.workout.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({ error: 'Failed to delete workout' });
  }
};

// Get all exercises (for workout creation/editing)
export const getAllExercises = async (req: Request, res: Response) => {
  try {
    const exercises = await prisma.exercise.findMany({
      orderBy: { name: 'asc' }
    });

    res.json(exercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
};
