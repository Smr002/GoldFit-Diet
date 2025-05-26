import { PrismaClient, Notification as PrismaNotification, Prisma } from '@prisma/client';
import { NotificationModel, Notification, WorkoutReminderNotification, ProgressNotification, AdminNotification } from './notificationModel';

const prisma = new PrismaClient();

type FullPrismaNotification = PrismaNotification & {
  deletedAt: Date | null;
  createdByUserId: number | null;
  createdByAdminId: number | null;
};

const mapPrismaToNotification = (prismaNotification: FullPrismaNotification): Notification => {
  return {
    id: prismaNotification.id,
    type: prismaNotification.type as Notification['type'],
    message: prismaNotification.message,
    isAutomated: prismaNotification.isAutomated,
    frequency: (prismaNotification.frequency as Notification['frequency']) || undefined,
    targetUsers: prismaNotification.targetUsers as Notification['targetUsers'],
    createdByUserId: prismaNotification.createdByUserId || undefined,
    createdByAdminId: prismaNotification.createdByAdminId || undefined,
    createdAt: prismaNotification.createdAt,
    updatedAt: prismaNotification.updatedAt,
    deletedAt: prismaNotification.deletedAt || undefined,
  };
};

export class NotificationRepository {
  async createNotification(data: Partial<Notification>): Promise<Notification> {
    const notificationModel = new NotificationModel({
      ...data,
      // Ignore any incoming id field from the frontend
      id: undefined,
      // Allow frequency to be set regardless of isAutomated
      frequency: data.frequency,
    });
    if (!notificationModel.isValid()) {
      throw new Error('Invalid notification data');
    }

    // Verify the creator exists if createdByUserId is provided
    if (data.createdByUserId) {

      const creator = await prisma.user.findUnique({
        where: { id: data.createdByUserId }
      });
 
      if (!creator) {
        throw new Error('Creator user not found');
      }
    }

    const notificationData = notificationModel.toObject();
  
    const prismaNotification = await prisma.notification.create({
      data: {
        type: notificationData.type,
        message: notificationData.message,
        isAutomated: notificationData.isAutomated,
        frequency: notificationData.frequency,
        targetUsers: notificationData.targetUsers,
        createdByUserId: notificationData.createdByUserId,
        createdByAdminId: notificationData.createdByAdminId,
      },
    }) as FullPrismaNotification;

    return mapPrismaToNotification(prismaNotification);
  }

  async getNotificationById(id: number): Promise<Notification | null> {
    const prismaNotification = await prisma.notification.findUnique({
      where: { id },
      include: { adminCreator: true },
    }) as FullPrismaNotification | null;

    return prismaNotification ? mapPrismaToNotification(prismaNotification) : null;
  }

  async updateNotification(id: number, data: Partial<Notification>): Promise<Notification> {
    const notificationModel = new NotificationModel(data);
    if (!notificationModel.isValid()) {
      throw new Error('Invalid notification data');
    }

    const notificationData = notificationModel.toObject();
    const prismaNotification = await prisma.notification.update({
      where: { id },
      data: {
        type: notificationData.type,
        message: notificationData.message,
        isAutomated: notificationData.isAutomated,
        frequency: notificationData.frequency,
        targetUsers: notificationData.targetUsers,
        createdByAdminId: notificationData.createdByAdminId,
      },
    }) as FullPrismaNotification;

    return mapPrismaToNotification(prismaNotification);
  }

  async deleteNotification(id: number): Promise<Notification> {
    const prismaNotification = await prisma.notification.delete({
      where: { id },
    }) as FullPrismaNotification;

    return mapPrismaToNotification(prismaNotification);
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
    
    const prismaNotifications = await prisma.notification.findMany({
      where: {
        OR: [
          { id: { in: notificationIds } },
          { targetUsers: 'ALL_USERS' },
          { targetUsers: 'PREMIUM_USERS', ...(user.isPremium ? {} : { id: -1 }) },
        ],
      },
      orderBy: { createdAt: 'desc' },
    }) as FullPrismaNotification[];

    return prismaNotifications.map(mapPrismaToNotification);
  }

  async createWorkoutReminder(data: WorkoutReminderNotification): Promise<Notification> {
    const notificationData: Partial<Notification> = {
      type: 'WORKOUT_REMINDER',
      message: data.message,
      isAutomated: true,
      targetUsers: 'SPECIFIC_USERS',
    };

    return this.createNotification(notificationData);
  }

  async createProgressNotification(data: ProgressNotification): Promise<Notification> {
    const notificationData: Partial<Notification> = {
      type: 'PROGRESS_UPDATE',
      message: data.message,
      isAutomated: true,
      targetUsers: 'SPECIFIC_USERS',
    };

    return this.createNotification(notificationData);
  }

  async createAdminNotification(data: AdminNotification): Promise<Notification> {
    const notificationData: Partial<Notification> = {
      type: 'ADMIN_MESSAGE',
      message: data.message,
      isAutomated: false,
      targetUsers: data.targetUsers,
      createdByAdminId: data.createdBy,
    };

    return this.createNotification(notificationData);
  }

  async getAllNotifications(): Promise<Notification[]> {
    const prismaNotifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    }) as FullPrismaNotification[];

    return prismaNotifications.map(mapPrismaToNotification);
  }
}
