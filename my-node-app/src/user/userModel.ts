import { z } from "zod";

export const UserSchema = z.object({
  id: z.bigint().optional(),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long." })
    .max(100, { message: "Name must be at most 100 characters long." })
    .regex(/^[a-zA-Z\s.'-]+$/, { message: "Invalid name format." }),
  email: z.string().email({ message: "Invalid email format." }),
  passwordHash: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  role: z.enum(["student", "professor"]),
  createdAt: z.date().optional(),
});

export type User = z.infer<typeof UserSchema>;

export class UserModel {
  private data: User;

  constructor(options: Partial<User>) {
    this.data = UserSchema.parse({
      ...options,
      name: options.name?.trim() || "",
      email: options.email?.toLowerCase() || "",
      passwordHash: options.passwordHash || "",
      role: options.role || "student",
      createdAt: options.createdAt || new Date(),
    });
  }

  toObject(): User {
    return this.data;
  }

  isValid(): boolean {
    try {
      UserSchema.parse(this.data);
      return true;
    } catch (error) {
      console.error("Validation failed:", error);
      return false;
    }
  }
}
