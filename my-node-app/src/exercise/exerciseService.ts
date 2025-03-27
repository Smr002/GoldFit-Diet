import { Exercise } from "@prisma/client";
import { ExerciseRepository } from "./exerciseRepository";
import { ExerciseModel } from "./exerciseModel";
import { authenticateJWT } from "../auth/JWT/authMiddleware";

export class ExerciseService {
  private repository: ExerciseRepository;

  constructor() {
    this.repository = new ExerciseRepository();
  }

  async createExercise(data: { name: string; muscleGroup: string }): Promise<Exercise> {
    const exerciseModel = new ExerciseModel({
      name: data.name,
      muscleGroup: data.muscleGroup,
    });

    if (!exerciseModel.isValid()) {
      throw new Error("Invalid exercise data");
    }

    return this.repository.createExercise(exerciseModel);
  }

  async getExerciseById(id: number): Promise<Exercise | null> {
    return this.repository.getExerciseById(id);
  }

  async getAllExercises(): Promise<Exercise[]> {
    return this.repository.getAllExercises();
  }

  async updateExercise(id: number, data: { name?: string; muscleGroup?: string }): Promise<Exercise> {
    const existingExercise = await this.repository.getExerciseById(id);
    if (!existingExercise) {
      throw new Error(`Exercise with ID ${id} not found`);
    }

    // Convert null values to appropriate defaults before passing to the model
    const exerciseModel = new ExerciseModel({
      id: existingExercise.id,
      name: data.name ?? existingExercise.name,
      muscleGroup: data.muscleGroup ?? existingExercise.muscleGroup ?? "",
      createdAt: existingExercise.createdAt,
      updatedAt: new Date()
    });

    if (!exerciseModel.isValid()) {
      throw new Error("Invalid exercise data");
    }

    return this.repository.updateExercise(id, exerciseModel);
  }

  async deleteExercise(id: number): Promise<Exercise> {
    const existingExercise = await this.repository.getExerciseById(id);
    if (!existingExercise) {
      throw new Error(`Exercise with ID ${id} not found`);
    }

    return this.repository.deleteExercise(id);
  }
}