import { Goal, User } from "@prisma/client";

export type UserCreateInput = Omit<User, "id"> & {
  activeWorkoutId?: number | null;
  deletedAt?: Date | null;
};

const goalLabelToEnum: Record<string, Goal> = {
    "Lose Weight": Goal.WEIGHT_LOSS,
    "Gain Muscle Mass": Goal.MUSCLE_GAIN,
    "Maintain": Goal.MAINTENANCE,
    "Build Strength": Goal.STRENGTH,
    "Improve Endurance": Goal.ENDURANCE,
  };
  

export function mapCreateUserInput(body: any, hashedPassword: string): UserCreateInput {
  const [firstName = "", lastName = ""] = (body.fullName || "").trim().split(" ");

  return {
    email: body.email?.toLowerCase() || "",
    password: hashedPassword,
    firstName,
    lastName,
    age: parseInt(body.age) || 25,
    gender: body.selectedGender || "Unknown",
    height: parseFloat(body.selectedHeight) || 0,
    weight: parseFloat(body.selectedWeight) || 0,
    goal: goalLabelToEnum[body.selectedGoal] || "LOSE_WEIGHT",
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
