import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./auth/JWT/authRouter";
import userRoutes from "./user/userRouter";
import { authenticateJWT } from "./auth/JWT/authMiddleware";
import workoutRouter from "./workout/workoutRouter";

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

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
