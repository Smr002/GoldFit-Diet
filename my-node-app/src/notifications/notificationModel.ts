import { Notification, NotificationAudience, Admin } from '@prisma/client';

export interface CreateNotificationDto {
  type: string;
  message: string;
  isAutomated: boolean;
  frequency?: string;
  targetUsers: NotificationAudience;
  createdBy?: number;
}

export interface UpdateNotificationDto {
  type?: string;
  message?: string;
  isAutomated?: boolean;
  frequency?: string;
  targetUsers?: NotificationAudience;
}

export interface NotificationWithRelations extends Notification {
  creator?: Admin;
}

export interface WorkoutReminderNotification {
  userId: number;
  workoutId: number;
  message: string;
}

export interface ProgressNotification {
  userId: number;
  achievement: string;
  message: string;
}

export interface AdminNotification {
  targetUsers: NotificationAudience;
  message: string;
  createdBy: number;
}
