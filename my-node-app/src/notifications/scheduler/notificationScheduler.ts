import cron from 'node-cron';
import { NotificationService } from '../notificationService';

const notificationService = new NotificationService();

export class NotificationScheduler {
  private static instance: NotificationScheduler;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): NotificationScheduler {
    if (!NotificationScheduler.instance) {
      NotificationScheduler.instance = new NotificationScheduler();
    }
    return NotificationScheduler.instance;
  }

  public initialize() {
    if (this.isInitialized) {
      return;
    }

    // Run every day at 9 AM
    cron.schedule('0 9 * * *', async () => {
      try {
        console.log('Running automated notification checks...');
        await notificationService.checkMissedWorkouts();
        await notificationService.checkProgressAchievements();
        console.log('Automated notification checks completed successfully');
      } catch (error) {
        console.error('Error running automated notifications:', error);
      }
    });

    this.isInitialized = true;
    console.log('Notification scheduler initialized');
  }
} 