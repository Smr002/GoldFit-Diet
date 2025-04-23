import { NotificationRepository } from './notificationRepository';
import { CreateNotificationDto, WorkoutReminderNotification, ProgressNotification, AdminNotification } from './notificationModel';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const notificationRepository = new NotificationRepository();

export class NotificationService {
  async createNotification(data: CreateNotificationDto) {
    return notificationRepository.createNotification(data);
  }

  async getNotificationById(id: number) {
    return notificationRepository.getNotificationById(id);
  }

  async getNotificationsByUser(userId: number) {
    return notificationRepository.getNotificationsByUser(userId);
  }

  async sendWorkoutReminder(data: WorkoutReminderNotification) {
    const notification = await notificationRepository.createWorkoutReminder(
      data.userId,
      data.workoutId,
      data.message
    );

    // Create sent notification record
    await prisma.sentNotification.create({
      data: {
        notificationId: notification.id,
        userId: data.userId,
        sentAt: new Date(),
      },
    });

    // TODO: Implement email sending logic here
    // await this.sendEmail(data.userId, data.message);

    return notification;
  }

  async sendProgressNotification(data: ProgressNotification) {
    const notification = await notificationRepository.createProgressNotification(
      data.userId,
      data.achievement,
      data.message
    );

    await prisma.sentNotification.create({
      data: {
        notificationId: notification.id,
        userId: data.userId,
        sentAt: new Date(),
      },
    });

    return notification;
  }

  async sendAdminNotification(data: AdminNotification) {
    const notification = await notificationRepository.createAdminNotification(
      data.targetUsers,
      data.message,
      data.createdBy
    );

    // Get target users based on audience
    const users = await this.getTargetUsers(data.targetUsers);

    // Create sent notification records for all target users
    await Promise.all(
      users.map(user =>
        prisma.sentNotification.create({
          data: {
            notificationId: notification.id,
            userId: user.id,
            sentAt: new Date(),
          },
        })
      )
    );

    return notification;
  }

  private async getTargetUsers(targetUsers: string) {
    switch (targetUsers) {
      case 'ALL_USERS':
        return prisma.user.findMany();
      case 'PREMIUM_USERS':
        return prisma.user.findMany({
          where: { isPremium: true },
        });
      default:
        return [];
    }
  }

  async checkMissedWorkouts() {
    const users = await prisma.user.findMany({
      where: { notifyWorkoutSessions: true },
      include: { activeWorkout: true },
    });

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    for (const user of users) {
      if (!user.activeWorkout) continue;

      const lastSession = await prisma.workoutSession.findFirst({
        where: {
          userId: user.id,
          workoutId: user.activeWorkout.id,
        },
        orderBy: { date: 'desc' },
      });

      if (!lastSession || lastSession.date < yesterday) {
        await this.sendWorkoutReminder({
          userId: user.id,
          workoutId: user.activeWorkout.id,
          message: `You missed your workout session yesterday. Don't forget to stay on track with your fitness goals!`,
        });
      }
    }
  }

  async checkProgressAchievements() {
    const users = await prisma.user.findMany({
      where: { notifyMotivational: true },
    });

    for (const user of users) {
      const lastWeekSessions = await prisma.workoutSession.count({
        where: {
          userId: user.id,
          date: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      });

      if (lastWeekSessions >= 5) {
        await this.sendProgressNotification({
          userId: user.id,
          achievement: 'Weekly Workout Streak',
          message: `Amazing work! You've completed ${lastWeekSessions} workouts this week. Keep up the great progress!`,
        });
      }
    }
  }
}
