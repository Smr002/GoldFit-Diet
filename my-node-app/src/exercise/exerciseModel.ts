import{z} from "zod";

export const ExerciseSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  muscleGroup: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional().nullable(),
});

export type Exercise = z.infer<typeof ExerciseSchema>;

export class ExerciseModel {
  private data: Exercise;

  constructor(options: Partial<Exercise>) {
    this.data = ExerciseSchema.parse({
      ...options,
      name: options.name?.trim() || "",
      muscleGroup: options.muscleGroup?.trim() || "",
      createdAt: options.createdAt ?? new Date(),
      updatedAt: options.updatedAt ?? new Date(),
    });
  }

  toObject(): Exercise {
    return this.data;
  }

  isValid(): boolean {
    try {
      ExerciseSchema.parse(this.data);
      return true;
    } catch (error) {
      console.error("Validation failed:", error);
      return false;
    }
  }

  // Helper methods for exercise properties
  setName(name: string): void {
    this.data.name = name.trim();
    this.data.updatedAt = new Date();
  }

  

  setMuscleGroup(muscleGroup: string): void {
    this.data.muscleGroup = muscleGroup.trim();
    this.data.updatedAt = new Date();
  }

 

  // Getter methods
  getName(): string {
    return this.data.name;
  }

  

  getMuscleGroup(): string {
    return this.data.muscleGroup;
  }

  
}
