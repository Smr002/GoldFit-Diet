import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./auth/JWT/authRouter";
import userRoutes from "./user/userRouter";
import { authenticateJWT } from "./auth/JWT/authMiddleware";
import workoutRouter from "./workout/workoutRouter";
import exerciseRouter from "./exercise/exerciseRouter";
import nutritionRouter from './nutrition/nutritionRouter';
import adminRoutes from './admin/adminRoutes';
import notificationRouter from './notifications/notificationRouter';
import weeklySummary from "./summary/weeklySummaryRouter";
import paymentRouter from "./payment/paymentRouter";
import { getAdminProfile, getUserProfile } from './profile/profileController';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/workouts", workoutRouter);
app.use("/exercises", exerciseRouter);
app.use("/nutrition", nutritionRouter);
app.use("/admin", adminRoutes);
app.use("/notifications", notificationRouter);
app.use("/summary",weeklySummary);
app.use("/notify",paymentRouter)
app.use("/profile", getUserProfile);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
