import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all admins with pagination and filtering
export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', search = '', role = '' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause based on search and role
    let whereClause: any = {
      user: {
        deletedAt: null
      }
    };

    if (search) {
      whereClause.user = {
        ...whereClause.user,
        OR: [
          { firstName: { contains: search as string, mode: 'insensitive' } },
          { lastName: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } }
        ]
      };
    }

    if (role) {
      whereClause.role = { equals: role, mode: 'insensitive' };
    }

    // Get admins with pagination
    const admins = await prisma.admin.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            exercises: true,
            workouts: true,
            notifications: true
          }
        }
      },
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' }
    });

    // Format admins for response
    const formattedAdmins = admins.map(admin => ({
      id: admin.id,
      userId: admin.userId,
      email: admin.user.email,
      firstName: admin.user.firstName,
      lastName: admin.user.lastName,
      role: admin.role,
      permissions: admin.permissions,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      stats: {
        exercises: admin._count.exercises,
        workouts: admin._count.workouts,
        notifications: admin._count.notifications
      }
    }));

    // Get total count for pagination
    const totalAdmins = await prisma.admin.count({ where: whereClause });

    res.json({
      admins: formattedAdmins,
      pagination: {
        total: totalAdmins,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalAdmins / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
};

// Get admin by ID
export const getAdminById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const admin = await prisma.admin.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            exercises: true,
            workouts: true,
            notifications: true
          }
        }
      }
    });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Format admin for response
    const formattedAdmin = {
      id: admin.id,
      userId: admin.userId,
      email: admin.user.email,
      firstName: admin.user.firstName,
      lastName: admin.user.lastName,
      role: admin.role,
      permissions: admin.permissions,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      stats: {
        exercises: admin._count.exercises,
        workouts: admin._count.workouts,
        notifications: admin._count.notifications
      }
    };

    res.json(formattedAdmin);
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).json({ error: 'Failed to fetch admin' });
  }
};

// Update an admin
export const updateAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role, permissions } = req.body;
    const currentAdminId = req.user?.adminId; // Assuming adminId is available in the request after authentication

    if (!currentAdminId) {
      return res.status(403).json({ error: 'Only admins can update admin roles' });
    }

    // Check if the current admin is trying to update themselves
    if (parseInt(id) === currentAdminId) {
      // Get current admin to check role
      const currentAdmin = await prisma.admin.findUnique({
        where: { id: currentAdminId }
      });

      // Only allow super admins to update their own role
      if (currentAdmin?.role !== 'super_admin' && role && role !== currentAdmin?.role) {
        return res.status(403).json({ error: 'You cannot change your own admin role' });
      }
    }

    // Build update data
    const updateData: any = {};
    
    if (role) updateData.role = role;
    if (permissions) {
      try {
        updateData.permissions = typeof permissions === 'string' 
          ? JSON.parse(permissions) 
          : permissions;
      } catch (e) {
        return res.status(400).json({ error: 'Invalid permissions format' });
      }
    }

    // Update admin
    const updatedAdmin = await prisma.admin.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json({
      id: updatedAdmin.id,
      role: updatedAdmin.role,
      name: `${updatedAdmin.user.firstName} ${updatedAdmin.user.lastName}`,
      message: 'Admin updated successfully'
    });
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ error: 'Failed to update admin' });
  }
};

// Remove admin role
export const removeAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentAdminId = req.user?.adminId; // Assuming adminId is available in the request after authentication

    if (!currentAdminId) {
      return res.status(403).json({ error: 'Only admins can remove admin roles' });
    }

    // Check if the current admin is trying to remove themselves
    if (parseInt(id) === currentAdminId) {
      return res.status(403).json({ error: 'You cannot remove your own admin role' });
    }

    // Get admin to be removed
    const admin = await prisma.admin.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Get current admin
    const currentAdmin = await prisma.admin.findUnique({
      where: { id: currentAdminId }
    });

    // Only super admins can remove other admins
    if (currentAdmin?.role !== 'super_admin') {
      return res.status(403).json({ error: 'Only super admins can remove admin roles' });
    }

    // Delete admin
    await prisma.admin.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      message: `Admin role removed from ${admin.user.firstName} ${admin.user.lastName}`
    });
  } catch (error) {
    console.error('Error removing admin:', error);
    res.status(500).json({ error: 'Failed to remove admin' });
  }
};

// Get admin roles
export const getAdminRoles = async (req: Request, res: Response) => {
  try {
    // Get distinct roles
    const roles = await prisma.admin.findMany({
      select: {
        role: true
      },
      distinct: ['role']
    });

    res.json(roles.map(r => r.role));
  } catch (error) {
    console.error('Error fetching admin roles:', error);
    res.status(500).json({ error: 'Failed to fetch admin roles' });
  }
};

// Get admin activity
export const getAdminActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get recent workouts created by admin
    const recentWorkouts = await prisma.workout.findMany({
      where: { createdByAdmin: parseInt(id) },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    // Get recent notifications created by admin
    const recentNotifications = await prisma.notification.findMany({
      where: { createdBy: parseInt(id) },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    // Get recent exercises created by admin
    const recentExercises = await prisma.exercise.findMany({
      where: { createdBy: parseInt(id) },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    res.json({
      recentWorkouts,
      recentNotifications,
      recentExercises
    });
  } catch (error) {
    console.error('Error fetching admin activity:', error);
    res.status(500).json({ error: 'Failed to fetch admin activity' });
  }
};
