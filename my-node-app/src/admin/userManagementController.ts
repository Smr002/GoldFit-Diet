import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Get all users with pagination and filtering
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', search = '', filter = '' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause based on search and filter
    let whereClause: any = {
      deletedAt: null,
    };

    if (search) {
      whereClause.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (filter === 'premium') {
      whereClause.isPremium = true;
    }

    // Get users with pagination
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        age: true,
        gender: true,
        height: true,
        weight: true,
        goal: true,
        isPremium: true,
        createdAt: true,
        admin: {
          select: {
            id: true,
            role: true
          }
        }
      },
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' }
    });

    // Get total count for pagination
    const totalUsers = await prisma.user.count({ where: whereClause });

    res.json({
      users,
      pagination: {
        total: totalUsers,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalUsers / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        age: true,
        gender: true,
        height: true,
        weight: true,
        goal: true,
        isPremium: true,
        createdAt: true,
        admin: {
          select: {
            id: true,
            role: true,
            permissions: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, age, gender, height, weight, goal, isPremium } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        age: parseInt(age as string),
        gender,
        height: parseFloat(height as string),
        weight: parseFloat(weight as string),
        goal,
        isPremium: isPremium === true || isPremium === 'true'
      }
    });

    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, firstName, lastName, age, gender, height, weight, goal, isPremium, password } = req.body;

    // Build update data
    const updateData: any = {};
    
    if (email) updateData.email = email;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (age) updateData.age = parseInt(age as string);
    if (gender) updateData.gender = gender;
    if (height) updateData.height = parseFloat(height as string);
    if (weight) updateData.weight = parseFloat(weight as string);
    if (goal) updateData.goal = goal;
    if (isPremium !== undefined) updateData.isPremium = isPremium === true || isPremium === 'true';
    
    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        age: true,
        gender: true,
        height: true,
        weight: true,
        goal: true,
        isPremium: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Soft delete a user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;

    console.log("Received ID for deletion:", id); // Debugging log
    console.log("Authorization header:", authHeader); // Debugging log

    // Validate the ID
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Perform soft delete
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
// Promote user to admin
export const promoteToAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role, permissions } = req.body;

    // Validate required parameters
    if (!role) {
      return res.status(400).json({ error: 'Role is required when promoting a user to admin' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { admin: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is already an admin
    if (user.admin) {
      // Update existing admin role
      const updatedAdmin = await prisma.admin.update({
        where: { userId: parseInt(id) },
        data: {
          role,
          permissions: typeof permissions === 'string' ? JSON.parse(permissions) : permissions
        }
      });

      return res.json({
        message: 'Admin role updated successfully',
        admin: updatedAdmin
      });
    }

    // Create new admin role for user
    const newAdmin = await prisma.admin.create({
      data: {
        userId: parseInt(id),
        role, // This is now guaranteed to be defined
        permissions: typeof permissions === 'string' ? JSON.parse(permissions) : permissions || {}
      }
    });

    res.json({
      message: 'User promoted to admin successfully',
      admin: newAdmin
    });
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    res.status(500).json({ error: 'Failed to promote user to admin' });
  }
};
