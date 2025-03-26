import { Request, Response } from 'express';
import { WorkoutService } from './workoutService';

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

  // Workout Session Operations
  async logWorkoutSession(req: Request, res: Response) {
    try {
      const userId = Number(req.user?.id);
      const { workoutId, date } = req.body;
      const session = await this.service.logWorkoutSession(
        userId,
        workoutId,
        new Date(date)
      );
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ error: 'Failed to log workout session' });
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
}

