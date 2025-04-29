import bcrypt from "bcrypt";
import type { Goal, User } from "@prisma/client";
import { mapCreateUserInput } from "./utlis/mapCreateUserInput" 
import { mapUpdateUserInput } from "./utlis/mapUpdateUserInput";
import { usersRepository } from "./userRepository";
import { toUpdateUserInput, toUpdateUserSchema } from "./userModel";
import { z } from "zod";

export class UserService {
 
  async getAllUsers(): Promise<User[]> {
    return usersRepository.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    return usersRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return usersRepository.findByEmail(email);
  }

  async createUser(rawData: any) {
    try {

      const hashedPassword = await bcrypt.hash(rawData.password, 10);
      const prismaUserData = mapCreateUserInput(rawData, hashedPassword);
      return usersRepository.create(prismaUserData);
    } catch (error) {
      console.error("Error in createUser:", error); 
      throw error;
    }
  }
  
  async updateUser(id: number, data: toUpdateUserInput): Promise<User> {
    try {
      // Validate incoming data
      const validatedData = toUpdateUserSchema.parse(data);

      // Fetch the existing user to fill in missing fields
      const existingUser = await usersRepository.findById(id);
      if (!existingUser) {
        throw new Error("User not found");
      }

      // Map Prisma goal back to frontend format for merging
      const goalReverseMap: { [key: string]: string } = {
        WEIGHT_LOSS: "Lose Weight",
        MUSCLE_GAIN: "Gain Muscle",
        MAINTENANCE: "Maintain",
        STRENGTH: "Strength",
        ENDURANCE: "Endurance",
      };

      // Merge incoming data with existing user data
      const mergedData = {
        email: validatedData.email || existingUser.email,
        password: validatedData.password || undefined, // Will be hashed if present
        fullName: validatedData.fullName || `${existingUser.firstName} ${existingUser.lastName || ""}`,
        selectedAgeGroup: validatedData.selectedAgeGroup || String(existingUser.age),
        selectedGender: validatedData.selectedGender || existingUser.gender,
        selectedHeight: validatedData.selectedHeight ?? existingUser.height,
        selectedWeight: validatedData.selectedWeight ?? existingUser.weight,
        selectedGoal: validatedData.selectedGoal || goalReverseMap[existingUser.goal] || "Maintain",
      };

      // Hash password if provided
      const passwordForMapping = validatedData.password
        ? await bcrypt.hash(validatedData.password, 10)
        : existingUser.password;

      // Use mapUpdateUserInput to transform the data
      const mappedData = mapUpdateUserInput(mergedData, passwordForMapping);

      // Only include fields that have changed
      const updateData: Partial<User> = {};
      if (mappedData.email !== existingUser.email) updateData.email = mappedData.email;
      if (mappedData.password !== existingUser.password) updateData.password = mappedData.password;
      if (mappedData.firstName !== existingUser.firstName) updateData.firstName = mappedData.firstName;
      if (mappedData.lastName !== existingUser.lastName) updateData.lastName = mappedData.lastName;
      if (mappedData.age !== existingUser.age) updateData.age = mappedData.age;
      if (mappedData.gender !== existingUser.gender) updateData.gender = mappedData.gender;
      if (mappedData.height !== existingUser.height) updateData.height = mappedData.height;
      if (mappedData.weight !== existingUser.weight) updateData.weight = mappedData.weight;
      if (mappedData.goal !== existingUser.goal) updateData.goal = mappedData.goal;
      if (mappedData.preferredUnits !== existingUser.preferredUnits) updateData.preferredUnits = mappedData.preferredUnits;

      // Update the user
      const updatedUser = await usersRepository.update(id, updateData);

      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error.message, error.stack);
      throw new Error("Failed to update user: " + error.message);
    }
  }

  async deleteUser(id: number): Promise<User> {
    return usersRepository.delete(id);
  }

}

export const userService = new UserService();
