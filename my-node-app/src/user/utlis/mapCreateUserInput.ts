import { Goal, User } from "@prisma/client";

export type UserCreateInput = Omit<User, "id"> & {
  activeWorkoutId?: number | null;
  deletedAt?: Date | null;
};

const goalMapping: Record<string, Goal> = {
  "LOSE_WEIGHT": Goal.WEIGHT_LOSS,
  "BUILD_MUSCLE": Goal.MUSCLE_GAIN,
  "MAINTAIN": Goal.MAINTENANCE,
  "STRENGTH": Goal.STRENGTH,
  "ENDURANCE": Goal.ENDURANCE
};

export function mapCreateUserInput(body: any, hashedPassword: string): UserCreateInput {

  return {
    email: body.email?.toLowerCase() || "",
    password: hashedPassword,
    firstName: body.firstName || "",
    lastName: body.lastName || "",
    age: parseInt(body.age) || 25,
    gender: body.gender || "Unknown",
    height: parseFloat(body.height) || 0,
    weight: parseFloat(body.weight) || 0,
    goal: goalMapping[body.goal] || Goal.MAINTENANCE,
    notifyWorkoutSessions: false,
    notifyMotivational: false,
    preferredUnits: "metric",
    isPremium: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    activeWorkoutId: null, 
    deletedAt: null        
  };
}
