import { Request, Response } from "express";
import { userService } from "./userService";

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
    } catch (err) {
      res.status(400).json({ error: "Failed to create user." });
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

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const deletedUser = await userService.deleteUser(id);
      res.json(deletedUser);
    } catch (err) {
      res.status(400).json({ error: "Failed to delete user." });
    }
  }

  async getByRole(req: Request, res: Response) {
    try {
      const role = req.params.role as "student" | "professor";
      const users = await userService.getUsersByRole(role);
      res.json(users);
    } catch (err) {
      res.status(400).json({ error: "Invalid role." });
    }
  }
}

export const userController = new UserController();
