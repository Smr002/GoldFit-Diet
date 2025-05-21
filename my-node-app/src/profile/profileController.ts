import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Define the Zod schema for the admin profile response
const AdminProfileSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  createdDate: z.date(),
  lastActive: z.date(),
  role: z.string(),
  status: z.string(),
  permissions: z.array(z.string()).optional(),
  avatar: z.string().nullable().optional(),
});

const UserProfileSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  phone: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // Add more fields as needed
});

export const getAdminProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const admin = await prisma.admin.findUnique({
      where: { userId },
      include: { user: true }
    });

    if (!admin) {
      return res.status(404).json({ error: 'Admin profile not found' });
    }

    // Compose the profile data
    const profile = {
      name: `${admin.user.firstName || ''} ${admin.user.lastName || ''}`.trim(),
      email: admin.user.email,
      phone: admin.user.gender || '',
      createdDate: admin.user.createdAt,
      lastActive: admin.user.updatedAt,
      role: admin.role,
      status: 'Active',
      permissions: Array.isArray(admin.permissions) ? admin.permissions : [],
      //avatar: admin.user.avatar || null
    };

    // Validate with Zod
    const validatedProfile = AdminProfileSchema.parse(profile);

    res.json(validatedProfile);
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid profile data', details: err.errors });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate with Zod
    const validatedProfile = UserProfileSchema.parse(user);

    res.json(validatedProfile);
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid profile data', details: err.errors });
    }
    res.status(500).json({ error: 'Server error' });
  }
};