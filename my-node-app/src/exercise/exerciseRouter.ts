import { Router } from 'express';
import { ExerciseController } from './exerciseController';
import { authenticateJWT } from '../auth/JWT/authMiddleware';

const router = Router();
const controller = new ExerciseController();

// CRUD Routes
router.post('/', controller.createExercise.bind(controller));
router.get('/:id', controller.getExerciseById.bind(controller));
router.get('/', controller.getAllExercises.bind(controller));
router.put('/:id', controller.updateExercise.bind(controller));
router.delete('/:id', controller.deleteExercise.bind(controller));



export default router;