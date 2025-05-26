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
        where: { userId: id, deletedAt: null }, // Ensure admin is not deleted
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



  const { weight, height, age, gender, goal = Goal.MAINTENANCE } = data;


  let nutritionGoal: number | null = null;


  if (weight && height && age && gender) {
   
    const userAge =
  age === 3039 ? 35 :
  age === 1829 ? 25 :
  age === 4049 ? 45 :
  age;


  
    let bmr: number;
    if (gender.toLowerCase() === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * userAge + 5;
    } else if (gender.toLowerCase() === "female") {
      bmr = 10 * weight + 6.25 * height - 5 * userAge - 161;
    } else {
      throw new Error("Invalid gender specified for BMR calculation");
    }

    const activityFactor = 1.55;
    const tdee = bmr * activityFactor;
  


    switch (goal) {
      case Goal.MUSCLE_GAIN:
        nutritionGoal = Math.round(tdee + 350); 

        break;
      case Goal.WEIGHT_LOSS:
        nutritionGoal = Math.round(tdee - 500); 
        break;
      case Goal.MAINTENANCE:
      default:
        nutritionGoal = Math.round(tdee);
        break;
    }
  }

  return this.prisma.user.create({
    data: {
      ...data,
      goal,
      nutritionGoal, 
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

  async findAllAdmins(): Promise<User[]> {
    // Get all admin userIds from the admin table
    const adminRecords = await this.prisma.admin.findMany({
      where: { deletedAt: null },
      select: { userId: true }
    });
    const adminUserIds = adminRecords.map(a => a.userId);
    if (adminUserIds.length === 0) return [];
    // Query users table for those userIds, only active (not deleted)
    return this.prisma.user.findMany({
      where: {
        id: { in: adminUserIds },
        deletedAt: null,
      },
    });
  }
}

export const usersRepository = new UsersRepository();
