import bcrypt from "bcrypt";
import { UsersRepository } from "./userRepository";
import type { User } from "@prisma/client";

export class UserService {
  constructor(private usersRepo = new UsersRepository()) {}

  async getAllUsers(): Promise<User[]> {
    return this.usersRepo.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.usersRepo.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findByEmail(email);
  }

  async createUser(data: Omit<User, "id">): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.passwordHash, 10);
    return this.usersRepo.create({
      ...data,
      passwordHash: hashedPassword,
    });
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    if (data.passwordHash) {
      data.passwordHash = await bcrypt.hash(data.passwordHash, 10);
    }
    return this.usersRepo.update(id, data);
  }

  async deleteUser(id: number): Promise<User> {
    return this.usersRepo.delete(id);
  }

  async findUserByDetails(
    details: Pick<User, "email" | "name">
  ): Promise<{ id: number } | null> {
    return this.usersRepo.findUserByDetails(details);
  }

  async getUsersByRole(role: "student" | "professor"): Promise<User[]> {
    return this.usersRepo.findUsersByRole(role);
  }
}

export const userService = new UserService();
