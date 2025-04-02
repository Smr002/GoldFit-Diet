import { Goal, User } from "@prisma/client";

export type UserCreateInput = Omit<User, "id">;
function mapGoal(selectedGoal: string): Goal {
  switch (selectedGoal) {
    case "Lose Weight":
      return Goal.WEIGHT_LOSS;
    case "Gain Muscle Mass":
      return Goal.MUSCLE_GAIN;
    case "Maintain Weight":
      return Goal.MAINTENANCE;
    default:
      console.warn(`Unknown goal: ${selectedGoal}. Defaulting to MAINTENANCE.`);
      return Goal.MAINTENANCE;
  }
}
export function mapCreateUserInput(rawData: any, hashedPassword: string): UserCreateInput {
  const mappedData: UserCreateInput = {
    email: rawData.email,
    password: hashedPassword,
    firstName: rawData.fullName.split(" ")[0] || "",
    lastName: rawData.fullName.split(" ")[1] || "",
    age: parseInt(rawData.selectedAgeGroup.replace(/\D/g, ""), 10) || 0,
    gender: rawData.selectedGender || "Unknown",
    height: rawData.selectedHeight || 0,
    weight: rawData.selectedWeight || 0,
    goal:mapGoal(rawData.selectedGoal),
    notifyWorkoutSessions: false,
    notifyMotivational: false,
    preferredUnits: "metric",
    isPremium: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    activeWorkoutId: null,
    deletedAt: null,
  };


  mappedData.goal = mapGoal(rawData.selectedGoal);


  return mappedData;
}



