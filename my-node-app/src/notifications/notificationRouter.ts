import { Router } from 'express';
import { NotificationController } from './notificationController';
import { authenticateJWT } from '../auth/JWT/authMiddleware';

const router = Router();
const notificationController = new NotificationController();

router.use(authenticateJWT);

// Public routes
router.post('/workout-reminder', notificationController.sendWorkoutReminder.bind(notificationController));
router.post('/progress', notificationController.sendProgressNotification.bind(notificationController));

// Admin routes
router.post('/admin', notificationController.sendAdminNotification.bind(notificationController));
// These endpoints are meant to be called by a scheduled job/cron to check for missed workouts and progress
router.post('/check-missed-workouts', notificationController.checkMissedWorkouts.bind(notificationController));
router.post('/check-progress', notificationController.checkProgressAchievements.bind(notificationController));

// User routes
router.get('/user/:userId', notificationController.getNotificationsByUser.bind(notificationController));
router.get('/:id', notificationController.getNotificationById.bind(notificationController));
router.post('/', notificationController.createNotification.bind(notificationController));

export default router;
