import express from 'express';
import { homePage } from '../controllers/homeController';

const router = express.Router();

router.get('/', homePage);

export default router;
