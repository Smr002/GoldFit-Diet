import { Admin, Goal, PrismaClient, type User } from "@prisma/client";

export class UsersRepository {
  private prisma = new PrismaClient();

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        deletedAt: null, // Only active users
      },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        id,
           deletedAt: null,
      },
    });
  }

  async findAdminById(id: number): Promise<Admin | null> {
    try {
      if (!id || isNaN(id)) {
        throw new Error("Invalid admin ID");
      }

      return this.prisma.admin.findUnique({
        where: { userId: id },
        include: {
          user: true, // Include user data if needed
        },
      });
    } catch (error) {
      console.error("Error finding admin:", error);
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email,
           deletedAt: null,
      },
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

  async updatePremiumStatus(userId: number): Promise<User> {
    if (!userId) throw new Error("User ID is required");

    return this.prisma.user.update({
      where: {
        id: userId, // Correctly specify the user ID
      },
      data: {
        isPremium: true,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: number): Promise<User> {
    try {
      // Check if the user exists (regardless of deletedAt)
      const existingUser = await this.prisma.user.findUnique({ where: { id } });
      if (!existingUser) {
        throw new Error("User not found");
      }

      // If already deactivated, update the deletedAt timestamp
      const deletedUser = await this.prisma.user.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return deletedUser;
    } catch (error: any) {
      console.error(`Error in UsersRepository.delete for ID ${id}:`, {
        message: error.message,
        code: error.code,
        meta: error.meta,
      });
      throw error;
    }
  }
}

export const usersRepository = new UsersRepository();
