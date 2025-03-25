import { PrismaClient, type User } from "@prisma/client";

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
    return this.prisma.user.create({ data });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findUserByDetails(
    userData: Pick<User, "email" | "name">
  ): Promise<{ id: number } | null> {
    if (!userData.email || !userData.name) return null;

    return this.prisma.user.findFirst({
      where: {
        email: userData.email,
        name: userData.name,
      },
      select: { id: true },
    });
  }

  async findUsersByRole(role: "student" | "professor"): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { role },
    });
  }
}

export const usersRepository = new UsersRepository();
