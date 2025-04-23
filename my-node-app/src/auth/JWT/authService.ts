import { usersRepository } from "../../user/userRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";
const JWT_EXPIRES_IN = "1h";

export class AuthService {
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await usersRepository.findByEmail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("user password", user.password);
    console.log("password", password);
    console.log("user id", user.id);
    return isMatch ? user : null;
  }

  generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }
  getUserIdFromToken(token: string): number | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      return decoded.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
}

export const authService = new AuthService();
