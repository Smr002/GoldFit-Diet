import { Router } from 'express';
import { WorkoutController } from './workoutController';
import { authenticateJWT } from '../auth/JWT/authMiddleware';

const router = Router();
const controller = new WorkoutController();
router.get(
    '/personal-bests',
    authenticateJWT,                              // ← add this
    controller.getPersonalBests.bind(controller)
  );
// CRUD Routes
router.get('/streak',authenticateJWT,controller.getWorkoutStreak.bind(controller));

router.post('/',  controller.createWorkout.bind(controller));
router.get('/:id',  controller.getWorkoutById.bind(controller));
router.get('/',  controller.getAllWorkouts.bind(controller));
router.put('/:id',  controller.updateWorkout.bind(controller));
router.delete('/:id',  controller.deleteWorkout.bind(controller));

// Custom Workout Routes
router.post('/custom',  controller.createCustomWorkout.bind(controller));
router.get('/premade',  controller.getPreMadeWorkouts.bind(controller));

// Exercise Routes
router.get('/exercises/search',  controller.searchExercises.bind(controller));

// Workout Session Routes
router.post('/sessions', authenticateJWT, controller.logWorkoutSession.bind(controller));
router.get('/sessions/log', authenticateJWT, controller.getLogWorkoutSession.bind(controller));
router.get('/user/badges',authenticateJWT,controller.getUserBadge.bind(controller));
// Progress Tracking Routes
router.get('/:workoutId/progress',  controller.getWorkoutProgress.bind(controller));
router.get('/:workoutId/performance',  controller.getWorkoutPerformance.bind(controller));

router.get('/exercises/:exerciseId/maxpr', authenticateJWT, controller.getMaxPrForExercise.bind(controller));

router.get('/progress/weekly', authenticateJWT, controller.getWeeklyProgress.bind(controller));//get exercise and weight on the last 7 days
router.get('/progress/recent-exercises',authenticateJWT,controller.getRecentExercises.bind(controller)//get the last 3 exercises w the current& previous weight
  );

// Favorite Workout Routes
router.post('/:workoutId/favorite', authenticateJWT, controller.toggleFavoriteWorkout.bind(controller));
router.get('/favorites', authenticateJWT, controller.getFavoriteWorkouts.bind(controller));

export default router;
