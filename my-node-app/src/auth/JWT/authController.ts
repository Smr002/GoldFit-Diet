import { Request, Response } from "express";
import { authService } from "./authService";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const login = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }

  const { email, password } = result.data;
  const user = await authService.validateUser(email, password);
  if (user && typeof user === "object" && "error" in user && user.error === "deactivated") {
    return res.status(403).json({ error: "Your account has been deactivated. Please contact support if you believe this is a mistake." });
  }

if (!user || "error" in user) return res.status(401).json({ error: "Invalid credentials" });


  const token = authService.generateToken(user);
  res.json({
    token,
    user: {
      id: user.id,
      name: user.firstName,
      lastname:user.lastName,
      email: user.email,
     
    },
  });
};