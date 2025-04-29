import { z } from "zod";
export const GoalSchema = z.enum([
  "WEIGHT_LOSS",
  "MUSCLE_GAIN",
  "MAINTENANCE",
  "STRENGTH",
  "ENDURANCE"
]);

export const UserSchema = z.object({
  id: z.number().optional(), 
  email: z
    .string()
    .email({ message: "Invalid email format." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  age: z.number().min(0, { message: "Age must be >= 0." }),
  gender: z.string().min(1, { message: "Gender cannot be empty." }),
  height: z.number().min(0, { message: "Height must be >= 0." }),
  weight: z.number().min(0, { message: "Weight must be >= 0." }),
  goal: GoalSchema, 
  activeWorkoutId: z.number().optional().nullable(),
  notifyWorkoutSessions: z.boolean().optional().default(false),
  notifyMotivational: z.boolean().optional().default(false),
  preferredUnits: z.string().optional().default("metric"),
  isPremium: z.boolean().optional().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(), 
  deletedAt: z.date().optional().nullable(),
});

export const UpdateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1),
  selectedAgeGroup: z.string().min(1),
  selectedGender: z.string().min(1),
  selectedHeight: z.number().min(0),
  selectedWeight: z.number().min(0),
  selectedGoal: GoalSchema,
});

export const toUpdateUserSchema = UpdateUserSchema.partial();
export type User = z.infer<typeof UserSchema>;
export type toUpdateUserInput = z.infer<typeof toUpdateUserSchema>;


export class UserModel {
  private data: User;


  constructor(options: Partial<User>) {
    this.data = UserSchema.parse({
      ...options,

      email: options.email?.trim().toLowerCase() || "",
      firstName: options.firstName?.trim() || undefined,
      lastName: options.lastName?.trim() || undefined,
      createdAt: options.createdAt ?? new Date(),
      updatedAt: options.updatedAt ?? new Date(),

    });
  }

  toObject(): User {
    return this.data;
  }

  isValid(): boolean {
    try {
      UserSchema.parse(this.data);
      return true;
    } catch (error) {
      console.error("Validation failed:", error);
      return false;
    }
  }
}
