import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to safely convert BigInt to Number for JSON serialization
const safelySerialize = (data: any): any => {
  if (data === null || data === undefined) {
    return data;
  }
  
  if (typeof data === 'bigint') {
    return Number(data);
  }
  
  if (Array.isArray(data)) {
    return data.map(item => safelySerialize(item));
  }
  
  if (typeof data === 'object') {
    const result: Record<string, any> = {};
    for (const key in data) {
      result[key] = safelySerialize(data[key]);
    }
    return result;
  }
  
  return data;
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get total users count
    const totalUsers = await prisma.user.count({
      where: { deletedAt: null }
    });

    // Get total workouts count
    const totalWorkouts = await prisma.workout.count();

    // Get total notifications count
    const totalNotifications = await prisma.notification.count();

    // Get premium users count
    const premiumUsers = await prisma.user.count({
      where: { 
        isPremium: true,
        deletedAt: null
      }
    });

    // Get recent users (last 10 users)
    const recentUsers = await prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        age: true,
        gender: true,
        height: true,
        weight: true,
        goal: true,
        isPremium: true,
        createdAt: true
      }
    });

    // Get recent premium users
    const recentPremiumUsers = await prisma.user.findMany({
      where: { 
        isPremium: true,
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        age: true,
        gender: true,
        height: true,
        weight: true,
        goal: true,
        createdAt: true
      }
    });

    // Get user activity data (users created per day for the last 7 days)
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const userActivityData = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date, 
        COUNT(*) as count 
      FROM users 
      WHERE created_at >= ${sevenDaysAgo} 
      GROUP BY DATE(created_at) 
      ORDER BY date ASC
    `;

    // Get workout distribution by goal
    const workoutDistribution = await prisma.user.groupBy({
      by: ['goal'],
      _count: {
        id: true
      },
      where: { deletedAt: null }
    });

    // Format workout distribution for frontend
    const formattedWorkoutDistribution = workoutDistribution.map(item => ({
      name: item.goal,
      value: item._count.id
    }));

    // Get top workouts (most favorited)
    const topWorkouts = await prisma.favoriteWorkout.groupBy({
      by: ['workoutId'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    });

    // Get workout names for top workouts
    const topWorkoutsWithNames = await Promise.all(
      topWorkouts.map(async (item) => {
        const workout = await prisma.workout.findUnique({
          where: { id: item.workoutId },
          select: { name: true }
        });
        return {
          name: workout?.name || `Workout ${item.workoutId}`,
          value: item._count.id
        };
      })
    );

    // Convert any BigInt values to regular numbers before sending the response
    const responseData = {
      stats: {
        totalUsers,
        totalWorkouts,
        totalNotifications,
        premiumUsers
      },
      recentUsers,
      recentPremiumUsers,
      userActivityData: safelySerialize(userActivityData),
      workoutDistribution: formattedWorkoutDistribution,
      topWorkouts: topWorkoutsWithNames
    };
    
    res.json(responseData);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};
