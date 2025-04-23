import { Request, Response } from 'express';
import { NotificationService } from './notificationService';
import { CreateNotificationDto, WorkoutReminderNotification, ProgressNotification, AdminNotification } from './notificationModel';

const notificationService = new NotificationService();

export class NotificationController {
  async createNotification(req: Request, res: Response) {
    try {
      const data: CreateNotificationDto = req.body;
      const notification = await notificationService.createNotification(data);
      res.status(201).json(notification);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create notification' });
    }
  }

  async getNotificationById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const notification = await notificationService.getNotificationById(Number(id));
      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      res.json(notification);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get notification' });
    }
  }

  async getNotificationsByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const notifications = await notificationService.getNotificationsByUser(Number(userId));
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get notifications' });
    }
  }

  async sendWorkoutReminder(req: Request, res: Response) {
    try {
      const data: WorkoutReminderNotification = req.body;
      const notification = await notificationService.sendWorkoutReminder(data);
      res.status(201).json(notification);
    } catch (error) {
      res.status(500).json({ error: 'Failed to send workout reminder' });
    }
  }

  async sendProgressNotification(req: Request, res: Response) {
    try {
      const data: ProgressNotification = req.body;
      const notification = await notificationService.sendProgressNotification(data);
      res.status(201).json(notification);
    } catch (error) {
      res.status(500).json({ error: 'Failed to send progress notification' });
    }
  }

  async sendAdminNotification(req: Request, res: Response) {
    try {
      const data: AdminNotification = req.body;
      const notification = await notificationService.sendAdminNotification(data);
      res.status(201).json(notification);
    } catch (error) {
      res.status(500).json({ error: 'Failed to send admin notification' });
    }
  }

  async checkMissedWorkouts(req: Request, res: Response) {
    try {
      await notificationService.checkMissedWorkouts();
      res.json({ message: 'Missed workouts check completed' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to check missed workouts' });
    }
  }

  async checkProgressAchievements(req: Request, res: Response) {
    try {
      await notificationService.checkProgressAchievements();
      res.json({ message: 'Progress achievements check completed' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to check progress achievements' });
    }
  }
}
