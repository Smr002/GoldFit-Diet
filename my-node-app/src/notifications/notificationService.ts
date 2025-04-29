import { NotificationRepository } from './notificationRepository';
import { NotificationModel, Notification, WorkoutReminderNotification, ProgressNotification, AdminNotification } from './notificationModel';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class NotificationService {
  private repository: NotificationRepository;

  constructor() {
    this.repository = new NotificationRepository();
  }

  async createNotification(data: Partial<Notification>): Promise<Notification> {
    try {
      const notificationModel = new NotificationModel(data);
      if (!notificationModel.isValid()) {
        throw new Error('Invalid notification data');
      }
      return this.repository.createNotification(notificationModel.toObject());
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async getNotificationById(id: number): Promise<Notification | null> {
    try {
      return this.repository.getNotificationById(id);
    } catch (error) {
      console.error('Error getting notification:', error);
      throw error;
    }
  }

  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    try {
      return this.repository.getNotificationsByUser(userId);
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  async sendWorkoutReminder(data: WorkoutReminderNotification): Promise<Notification> {
    try {
      const notification = await this.repository.createWorkoutReminder(data);

      if (!notification.id) {
        throw new Error('Notification ID is required');
      }

      // Create sent notification record
      await prisma.sentNotification.create({
        data: {
          notificationId: notification.id,
          userId: data.userId,
          sentAt: new Date(),
        },
      });

      // TODO: Implement email sending logic
      return notification;
    } catch (error) {
      console.error('Error sending workout reminder:', error);
      throw error;
    }
  }

  async sendProgressNotification(data: ProgressNotification): Promise<Notification> {
    try {
      const notification = await this.repository.createProgressNotification(data);

      if (!notification.id) {
        throw new Error('Notification ID is required');
      }

      await prisma.sentNotification.create({
        data: {
          notificationId: notification.id,
          userId: data.userId,
          sentAt: new Date(),
        },
      });

      return notification;
    } catch (error) {
      console.error('Error sending progress notification:', error);
      throw error;
    }
  }

  async sendAdminNotification(data: AdminNotification): Promise<Notification> {
    try {
      const notification = await this.repository.createAdminNotification(data);

      if (!notification.id) {
        throw new Error('Notification ID is required');
      }

      // Get target users based on audience
      const targetUserIds = await this.getTargetUsers(data.targetUsers);

      // Create sent notification records for each target user
      for (const userId of targetUserIds) {
        await prisma.sentNotification.create({
          data: {
            notificationId: notification.id,
            userId,
            sentAt: new Date(),
          },
        });
      }

      return notification;
    } catch (error) {
      console.error('Error sending admin notification:', error);
      throw error;
    }
  }

  private async getTargetUsers(targetUsers: Notification['targetUsers']): Promise<number[]> {
    try {
      switch (targetUsers) {
        case 'ALL_USERS':
          return prisma.user.findMany().then(users => users.map(user => user.id));
        case 'PREMIUM_USERS':
          return prisma.user.findMany({
            where: { isPremium: true },
          }).then(users => users.map(user => user.id));
        default:
          return [];
      }
    } catch (error) {
      console.error('Error getting target users:', error);
      throw error;
    }
  }

  async checkMissedWorkouts(): Promise<void> {
    try {
      const users = await prisma.user.findMany({
        where: { notifyWorkoutSessions: true },
      });

      // TODO: Implement logic to check for missed workouts
    } catch (error) {
      console.error('Error checking missed workouts:', error);
      throw error;
    }
  }

  async checkProgressAchievements(): Promise<void> {
    try {
      const users = await prisma.user.findMany({
        where: { notifyMotivational: true },
      });

      // TODO: Implement logic to check for progress achievements
    } catch (error) {
      console.error('Error checking progress achievements:', error);
      throw error;
    }
  }
}
