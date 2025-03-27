import { Request, Response } from "express";
import { ExerciseService } from "./exerciseService";
import { z } from "zod";

export class ExerciseController {
  private service: ExerciseService;

  constructor() {
    this.service = new ExerciseService();
  }

  createExercise = async (req: Request, res: Response): Promise<void> => {
    try {
      const schema = z.object({
        name: z.string().min(1, { message: "Name is required" }),
        muscleGroup: z.string().min(1, { message: "Muscle group is required" }),
      });

      const validatedData = schema.parse(req.body);

      const exercise = await this.service.createExercise({
        name: validatedData.name,
        muscleGroup: validatedData.muscleGroup,
      });

      res.status(201).json(exercise);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error creating exercise:", error);
        res.status(500).json({ error: "Failed to create exercise" });
      }
    }
  };

  getExerciseById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID format" });
        return;
      }

      const exercise = await this.service.getExerciseById(id);
      if (!exercise) {
        res.status(404).json({ error: "Exercise not found" });
        return;
      }

      res.status(200).json(exercise);
    } catch (error) {
      console.error("Error fetching exercise:", error);
      res.status(500).json({ error: "Failed to fetch exercise" });
    }
  };

  getAllExercises = async (req: Request, res: Response): Promise<void> => {
    try {
      const exercises = await this.service.getAllExercises();
      res.status(200).json(exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      res.status(500).json({ error: "Failed to fetch exercises" });
    }
  };

  updateExercise = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID format" });
        return;
      }

      const schema = z.object({
        name: z.string().min(1).optional(),
        muscleGroup: z.string().min(1).optional(),
      });

      const validatedData = schema.parse(req.body);
      
      const exercise = await this.service.updateExercise(id, validatedData);
      res.status(200).json(exercise);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        console.error("Error updating exercise:", error);
        res.status(500).json({ error: "Failed to update exercise" });
      }
    }
  };

  deleteExercise = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID format" });
        return;
      }

      await this.service.deleteExercise(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof Error && error.message.includes("used in workouts")) {
        res.status(409).json({ error: error.message });
      } else {
        console.error("Error deleting exercise:", error);
        res.status(500).json({ error: "Failed to delete exercise" });
      }
    }
  };
}