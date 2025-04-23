import { PrismaClient, Notification, NotificationAudience, User } from '@prisma/client';
import { CreateNotificationDto, UpdateNotificationDto } from './notificationModel';

const prisma = new PrismaClient();

export class NotificationRepository {
  async createNotification(data: CreateNotificationDto): Promise<Notification> {
    return prisma.notification.create({
      data: {
        type: data.type,
        message: data.message,
        isAutomated: data.isAutomated,
        frequency: data.frequency,
        targetUsers: data.targetUsers,
        createdBy: data.createdBy,
      },
    });
  }

  async getNotificationById(id: number): Promise<Notification | null> {
    return prisma.notification.findUnique({
      where: { id },
      include: { creator: true },
    });
  }

  async updateNotification(id: number, data: UpdateNotificationDto): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data,
    });
  }

  async deleteNotification(id: number): Promise<Notification> {
    return prisma.notification.delete({
      where: { id },
    });
  }

  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { sentNotifications: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const notificationIds = user.sentNotifications.map(sn => sn.notificationId);
    
    return prisma.notification.findMany({
      where: {
        OR: [
          { id: { in: notificationIds } },
          { targetUsers: NotificationAudience.ALL_USERS },
          { targetUsers: NotificationAudience.PREMIUM_USERS, ...(user.isPremium ? {} : { id: -1 }) },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createWorkoutReminder(userId: number, workoutId: number, message: string): Promise<Notification> {
    return this.createNotification({
      type: 'WORKOUT_REMINDER',
      message,
      isAutomated: true,
      targetUsers: NotificationAudience.SPECIFIC_USERS,
      createdBy: undefined,
    });
  }

  async createProgressNotification(userId: number, achievement: string, message: string): Promise<Notification> {
    return this.createNotification({
      type: 'PROGRESS',
      message,
      isAutomated: true,
      targetUsers: NotificationAudience.SPECIFIC_USERS,
      createdBy: undefined,
    });
  }

  async createAdminNotification(targetUsers: NotificationAudience, message: string, createdBy: number): Promise<Notification> {
    return this.createNotification({
      type: 'ADMIN',
      message,
      isAutomated: false,
      targetUsers,
      createdBy,
    });
  }
}
