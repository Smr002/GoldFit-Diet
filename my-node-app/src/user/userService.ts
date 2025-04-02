import bcrypt from "bcrypt";
import type { Goal, User } from "@prisma/client";
import { mapCreateUserInput } from "./utlis/mapCreateUserInput";
import { usersRepository } from "./userRepository";

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
      console.log("Mapped Prisma User Data:", prismaUserData); 
      return usersRepository.create(prismaUserData);
    } catch (error) {
      console.error("Error in createUser:", error); 
      throw error;
    }
  }
  

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return usersRepository.update(id, data);
  }

  async deleteUser(id: number): Promise<User> {
    return usersRepository.delete(id);
  }

}

export const userService = new UserService();
