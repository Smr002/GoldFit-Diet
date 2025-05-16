import { Request, Response } from "express";
import { userService } from "./userService";
import { AuthenticatedRequest } from "../auth/JWT/authMiddleware";
export class UserController {
  async getAll(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch users." });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const user = await userService.getUserById(id);
      if (!user) return res.status(404).json({ error: "User not found." });
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: "Invalid ID." });
    }
  }

  async getAdminById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const user = await userService.getAdminById(id);
      if (!user) return res.status(404).json({ error: "User not found." });
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Invalid ID." });
    }
  }

  async getByEmail(req: Request, res: Response) {
    try {
      const email = req.params.email;
      const user = await userService.getUserByEmail(email);
      if (!user) return res.status(404).json({ error: "User not found." });
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: "Invalid email." });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newUser = await userService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (err: any) {
      res
        .status(400)
        .json({ error: "Failed to create user.", details: err?.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const updatedUser = await userService.updateUser(id, req.body);
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json({ error: "Failed to update user." });
    }
  }

async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID format" });
      }

      // Ensure the user is deleting their own account
      if (!req.user || req.user.id !== id) {
        return res.status(403).json({ error: "You can only delete your own account" });
      }

      const deletedUser = await userService.deleteUser(id);
      return res.json({ message: "User account deactivated", user: deletedUser });
    } catch (err: any) {
      console.error("Error in UserController.delete:", {
        message: err.message,
        code: err.code,
        stack: err.stack,
      });
      if (err.code === "P2025") {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(500).json({
        error: "Failed to deactivate user account",
        details: err.message || "Internal server error",
      });
    }
  }
}

export const userController = new UserController();
