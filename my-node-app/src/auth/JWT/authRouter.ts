import { Router } from "express";
import { login } from "./authController";

const router = Router();

router.post("/login", async (req, res) => {
  await login(req, res);
});

export default router;
