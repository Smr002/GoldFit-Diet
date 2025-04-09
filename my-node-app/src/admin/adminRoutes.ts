import express from 'express';
import * as adminDashboardController from './adminDashboardController';
import * as userManagementController from './userManagementController';
import * as workoutManagementController from './workoutManagementController';
import * as notificationManagementController from './notificationManagementController';
import * as adminManagementController from './adminManagementController';
import { authenticateJWT } from '../auth/JWT/authMiddleware';
import { isAdmin } from '../auth/JWT/authMiddleware';

const router = express.Router();

// Apply authentication middleware to all admin routes
// router.use(authenticateJWT);
// router.use(isAdmin);

// Dashboard routes
router.get('/dashboard/stats', adminDashboardController.getDashboardStats);

// User management routes
router.get('/users', userManagementController.getAllUsers);
router.get('/users/:id', userManagementController.getUserById);
router.post('/users', userManagementController.createUser);
router.put('/users/:id', userManagementController.updateUser);
router.delete('/users/:id', userManagementController.deleteUser);
router.post('/users/:id/promote', userManagementController.promoteToAdmin);

// Workout management routes
router.get('/workouts', workoutManagementController.getAllWorkouts);
router.get('/workouts/:id', workoutManagementController.getWorkoutById);
router.post('/workouts', workoutManagementController.createWorkout);
router.put('/workouts/:id', workoutManagementController.updateWorkout);
router.delete('/workouts/:id', workoutManagementController.deleteWorkout);
router.get('/exercises', workoutManagementController.getAllExercises);

// Notification management routes
router.get('/notifications', notificationManagementController.getAllNotifications);
router.get('/notifications/:id', notificationManagementController.getNotificationById);
router.post('/notifications', notificationManagementController.createNotification);
router.put('/notifications/:id', notificationManagementController.updateNotification);
router.delete('/notifications/:id', notificationManagementController.deleteNotification);
router.post('/notifications/:id/send', notificationManagementController.sendNotification);

// Admin management routes
router.get('/admins', adminManagementController.getAllAdmins);
router.get('/admins/:id', adminManagementController.getAdminById);
router.put('/admins/:id', adminManagementController.updateAdmin);
router.delete('/admins/:id', adminManagementController.removeAdmin);
router.get('/admin-roles', adminManagementController.getAdminRoles);
router.get('/admins/:id/activity', adminManagementController.getAdminActivity);

export default router;
