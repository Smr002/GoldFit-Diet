import { PrismaClient, Exercise } from "@prisma/client";
import { ExerciseModel } from "./exerciseModel";

export class ExerciseRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createExercise(exercise: ExerciseModel): Promise<Exercise> {
    const exerciseData = exercise.toObject();
    return this.prisma.exercise.create({
      data: {
        name: exerciseData.name,
        muscleGroup: exerciseData.muscleGroup
      },
    });
  }

  async getExerciseById(id: number): Promise<Exercise | null> {
    return this.prisma.exercise.findUnique({
      where: { id },
      include: {
        workoutExercises: true,
        sessionExercises: true
      }
    });
  }

  async getAllExercises(): Promise<Exercise[]> {
    return this.prisma.exercise.findMany();
  }

  async updateExercise(id: number, exercise: ExerciseModel): Promise<Exercise> {
    const exerciseData = exercise.toObject();
    return this.prisma.exercise.update({
      where: { id },
      data: {
        name: exerciseData.name,
        muscleGroup: exerciseData.muscleGroup
      },
    });
  }

  async deleteExercise(id: number): Promise<Exercise> {
    // First check if exercise is used in any workouts
    const usedInWorkouts = await this.prisma.workoutExercise.findFirst({
      where: { exerciseId: id }
    });
    
    if (usedInWorkouts) {
      throw new Error('Cannot delete exercise that is used in workouts');
    }

    // Delete the exercise
    return this.prisma.exercise.delete({
      where: { id },
    });
  }
}
