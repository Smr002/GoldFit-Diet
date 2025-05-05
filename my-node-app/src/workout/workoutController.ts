import { Request, Response } from 'express';
import { WorkoutService } from './workoutService';
import { AuthenticatedRequest } from "../auth/JWT/authMiddleware";

export class WorkoutController {
  private service: WorkoutService;

  constructor() {
    this.service = new WorkoutService();
  }

  // CRUD Operations
  async createWorkout(req: Request, res: Response) {
    try {
      const workout = await this.service.createWorkout(req.body);
      res.status(201).json(workout);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create workout hellooooo' });
      console.error(error);
    }
  }

  async getWorkoutById(req: Request, res: Response) {
    try {
      const workout = await this.service.getWorkoutById(Number(req.params.id));
      if (!workout) {
        return res.status(404).json({ error: 'Workout not found' });
      }
      res.json(workout);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get workout' });
    }
  }

  async getAllWorkouts(req: Request, res: Response) {
    try {
      const workouts = await this.service.getAllWorkouts();
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get workouts' });
    }
  }

  async updateWorkout(req: Request, res: Response) {
    try {
      const workout = await this.service.updateWorkout(Number(req.params.id), req.body);
      res.json(workout);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update workout' });
    }
  }

  async deleteWorkout(req: Request, res: Response) {
    try {
      await this.service.deleteWorkout(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete workout' });
      console.error(error);
    }
  }

  // Custom Workout Operations
  async createCustomWorkout(req: Request, res: Response) {
    try {
      const userId = Number(req.user?.id); // Assuming user is attached to request by auth middleware
      const workout = await this.service.createCustomWorkout(userId, req.body);
      res.status(201).json(workout);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create custom workout' });
    }
  }

  async getPreMadeWorkouts(req: Request, res: Response) {
    try {
      const workouts = await this.service.getPreMadeWorkouts();
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get pre-made workouts' });
    }
  }

  // Exercise Operations
  async searchExercises(req: Request, res: Response) {
    try {
      const { query, muscleGroup } = req.query;
      const exercises = await this.service.searchExercises(
        query as string,
        muscleGroup as string
      );
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ error: 'Failed to search exercises' });
    }
  }

  

  async logWorkoutSession(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      
      const userId = Number(req.user.id);
      const { workoutId, date, exercises } = req.body as {
        workoutId: number;
        date: string;
        exercises?: { exerciseId: number; setsCompleted?: number; repsCompleted?: number; weightUsed?: number }[];
      };
      
      const session = await this.service.logWorkoutSession(
        userId,
        workoutId,
        new Date(date),
        exercises
      );
      res.status(201).json(session);
    } catch (error) {
      console.error("Error logging workout session:", error);
      res.status(400).json({ error: 'Failed to log workout session' });
    }
  }

  async getUserBadge(req: Request, res: Response) {
    try {
      // Get userId from URL parameter instead of auth token
      const userId = Number(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const badges = await this.service.getUserBadge(userId);
      res.json(badges);
    } catch (error) {
      console.error("Error getting user badges:", error);
      res.status(500).json({ error: 'Failed to get user badges' });
    }
  }  

  async getSessionById(req: AuthenticatedRequest, res: Response) {
    try {
      const sessionId = Number((req as Request).params.id);
      const userId = Number(req.user?.id);

      const session = await this.service.getSessionById(sessionId, userId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.json(session);
    } catch (error) {
      res.status(403).json({ error: "Unauthorized or not found" });
    }
  }

  async updateSessionExercise(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = Number(req.user?.id);
      const sessionExerciseId = Number((req as Request).params.id);

      const { weightUsed, setsCompleted, repsCompleted } = (req as Request).body as {
        weightUsed?: number;
        setsCompleted?: number;
        repsCompleted?: number;
      };

      const updated = await this.service.updateSessionExercise(
        sessionExerciseId,
        userId,
        { weightUsed, setsCompleted, repsCompleted }
      );

      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: "Failed to update exercise info" });
    }
  }

  async getSessionHistory(req: AuthenticatedRequest, res: Response) {
    try {
      const limit = (req as Request).query.limit
        ? Number((req as Request).query.limit)
        : undefined;

      const userId = Number(req.user?.id);
      const sessions = await this.service.getUserSessionHistory(userId, limit);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch session history" });
    }
  }

  // Progress Tracking
  async getWorkoutProgress(req: Request, res: Response) {
    try {
      const userId = Number(req.user?.id);
      const workoutId = Number(req.params.workoutId);
      const progress = await this.service.getWorkoutProgress(userId, workoutId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get workout progress' });
    }
  }

  async getWorkoutPerformance(req: Request, res: Response) {
    try {
      const userId = Number(req.user?.id);
      const workoutId = Number(req.params.workoutId);
      const performance = await this.service.getWorkoutPerformance(userId, workoutId);
      res.json(performance);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get workout performance' });
    }
  }

  async getWorkoutStreak(req: Request, res: Response) {
    try {
      const userId = Number(req.user?.id);
      const streak = await this.service.getWorkoutStreak(userId);
      res.json({ streak });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get workout streak' });
    }
  }

  async getPersonalBests(req: Request, res: Response) {
    try {
      const userId = Number(req.user?.id);
      const personalBests = await this.service.getPersonalBests(userId);
      res.json(personalBests);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get personal bests' });
    }
  }

  async toggleFavoriteWorkout(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const userId = Number(req.user.id);
      const workoutId = Number(req.params.workoutId);
      
      const result = await this.service.toggleFavoriteWorkout(userId, workoutId);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: 'Failed to toggle favorite workout' });
    }
  }

  async getFavoriteWorkouts(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const userId = Number(req.user.id);
      const favoriteWorkouts = await this.service.getFavoriteWorkouts(userId);
      res.json(favoriteWorkouts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get favorite workouts' });
    }
  }
}

