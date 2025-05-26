// backend/src/services/utils/mapUpdateUserInput.ts
import type { User } from "@prisma/client";

export function mapUpdateUserInput(data: any, hashedPassword: string): Partial<User> {
  const mappedData = {
    email: data.email,
    password: hashedPassword,
    firstName: data.fullName.split(" ")[0] || "",
    lastName: data.fullName.split(" ").slice(1).join(" ") || "",
    age: parseInt(data.selectedAgeGroup) || 0,
    gender: data.selectedGender.toLowerCase(),
    height: data.selectedHeight,
    weight: data.selectedWeight,
    goal: data.selectedGoal.toUpperCase().replace(" ", "_"),
    preferred_units: "metric", // Default value
  };

  return mappedData;
}