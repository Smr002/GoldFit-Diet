import { Goal, PrismaClient, type User } from "@prisma/client";

export class UsersRepository {
  private prisma = new PrismaClient();

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: Omit<User, "id">): Promise<User> {
    console.log("Creating user with data:", JSON.stringify(data, null, 2));
    return this.prisma.user.create({
      data: {
        ...data,
        goal: data.goal || Goal.MAINTENANCE,
      },
    });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id }, // Use 'id' to match the schema
      data,
    });
    return updatedUser;
  }

  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

}

export const usersRepository = new UsersRepository();
