import { Router } from "express";
import { processPayment } from "./paymentController";
import { authenticateJWT } from "../auth/JWT/authMiddleware";

const router = Router();
router.use(authenticateJWT);
router.post("/pay", processPayment);

export default router;
