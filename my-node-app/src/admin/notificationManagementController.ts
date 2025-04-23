import { Request, Response } from 'express';
import { PrismaClient, NotificationAudience } from '@prisma/client';

const prisma = new PrismaClient();

// Get all notifications with pagination and filtering
export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', search = '', filter = '' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause based on search and filter
    let whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { type: { contains: search as string, mode: 'insensitive' } },
        { message: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (filter === 'automated') {
      whereClause.isAutomated = true;
    } else if (filter === 'manual') {
      whereClause.isAutomated = false;
    } else if (filter === 'all_users') {
      whereClause.targetUsers = 'ALL_USERS';
    } else if (filter === 'premium_users') {
      whereClause.targetUsers = 'PREMIUM_USERS';
    }

    // Get notifications with pagination
    const notifications = await prisma.notification.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        _count: {
          select: {
            sentNotifications: true
          }
        }
      },
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' }
    });

    // Format notifications for response
    const formattedNotifications = notifications.map(notification => ({
      id: notification.id,
      type: notification.type,
      message: notification.message,
      isAutomated: notification.isAutomated,
      frequency: notification.frequency,
      targetUsers: notification.targetUsers,
      createdBy: notification.creator 
        ? `${notification.creator.user.firstName} ${notification.creator.user.lastName}` 
        : 'System',
      createdAt: notification.createdAt,
      sentCount: notification._count.sentNotifications
    }));

    // Get total count for pagination
    const totalNotifications = await prisma.notification.count({ where: whereClause });

    res.json({
      notifications: formattedNotifications,
      pagination: {
        total: totalNotifications,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalNotifications / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Get notification by ID
export const getNotificationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(id) },
      include: {
        creator: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        sentNotifications: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          },
          take: 10,
          orderBy: { sentAt: 'desc' }
        }
      }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Format notification for response
    const formattedNotification = {
      id: notification.id,
      type: notification.type,
      message: notification.message,
      isAutomated: notification.isAutomated,
      frequency: notification.frequency,
      targetUsers: notification.targetUsers,
      createdBy: notification.creator 
        ? `${notification.creator.user.firstName} ${notification.creator.user.lastName}` 
        : 'System',
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
      recentRecipients: notification.sentNotifications.map(sn => ({
        id: sn.user.id,
        name: `${sn.user.firstName} ${sn.user.lastName}`,
        email: sn.user.email,
        sentAt: sn.sentAt
      }))
    };

    res.json(formattedNotification);
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ error: 'Failed to fetch notification' });
  }
};

// Create a new notification
export const createNotification = async (req: Request, res: Response) => {
  try {
    const { type, message, isAutomated, frequency, targetUsers, specificUserIds } = req.body;
  
    // const adminId = req.user?.adminId; // Assuming adminId is available in the request after authentication

    // if (!adminId) {

    //   return res.status(403).json({ error: 'Only admins can create notifications' });
    // }

    // Validate target users
    if (!Object.values(NotificationAudience).includes(targetUsers)) {
      return res.status(400).json({ error: 'Invalid target users value' });
    }

    // Create notification
    const newNotification = await prisma.notification.create({
      data: {
        type,
        message,
        isAutomated: isAutomated === true || isAutomated === 'true',
        frequency,
        targetUsers,
        createdBy: req.user?.id
      }
    });

    // Send notification to users based on target audience
    let userQuery: any = {};
    
    if (targetUsers === 'ALL_USERS') {
      userQuery = { deletedAt: null };
    } else if (targetUsers === 'PREMIUM_USERS') {
      userQuery = { isPremium: true, deletedAt: null };
    } else if (targetUsers === 'SPECIFIC_USERS' && specificUserIds && Array.isArray(specificUserIds)) {
      userQuery = { 
        id: { in: specificUserIds.map((id: string) => parseInt(id)) },
        deletedAt: null
      };
    }

    const users = await prisma.user.findMany({
      where: userQuery,
      select: { id: true }
    });

    // Create sent notifications for each user
    if (users.length > 0) {
      const sentNotifications = users.map(user => ({
        notificationId: newNotification.id,
        userId: user.id,
        sentAt: new Date()
      }));

      await prisma.sentNotification.createMany({
        data: sentNotifications
      });
    }

    res.status(201).json({
      id: newNotification.id,
      message: 'Notification created and sent successfully',
      recipientCount: users.length
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

// Update a notification
export const updateNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, message, isAutomated, frequency, targetUsers } = req.body;

    // Build update data
    const updateData: any = {};
    
    if (type) updateData.type = type;
    if (message) updateData.message = message;
    if (isAutomated !== undefined) updateData.isAutomated = isAutomated === true || isAutomated === 'true';
    if (frequency !== undefined) updateData.frequency = frequency;
    if (targetUsers && Object.values(NotificationAudience).includes(targetUsers)) {
      updateData.targetUsers = targetUsers;
    }

    // Update notification
    const updatedNotification = await prisma.notification.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({
      id: updatedNotification.id,
      message: 'Notification updated successfully'
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

// Delete a notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Delete sent notifications first
    await prisma.sentNotification.deleteMany({
      where: { notificationId: parseInt(id) }
    });

    // Delete notification
    await prisma.notification.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

// Send notification to users
export const sendNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { specificUserIds } = req.body;

    // Get notification
    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(id) }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Determine target users
    let userQuery: any = {};
    
    if (specificUserIds && Array.isArray(specificUserIds) && specificUserIds.length > 0) {
      // Send to specific users
      userQuery = { 
        id: { in: specificUserIds.map((id: string) => parseInt(id)) },
        deletedAt: null
      };
    } else {
      // Send based on notification target audience
      if (notification.targetUsers === 'ALL_USERS') {
        userQuery = { deletedAt: null };
      } else if (notification.targetUsers === 'PREMIUM_USERS') {
        userQuery = { isPremium: true, deletedAt: null };
      } else {
        return res.status(400).json({ error: 'No users specified for SPECIFIC_USERS target' });
      }
    }

    // Get users
    const users = await prisma.user.findMany({
      where: userQuery,
      select: { id: true }
    });

    if (users.length === 0) {
      return res.status(400).json({ error: 'No users found matching the criteria' });
    }

    // Create sent notifications for each user
    const sentNotifications = users.map(user => ({
      notificationId: parseInt(id),
      userId: user.id,
      sentAt: new Date()
    }));

    await prisma.sentNotification.createMany({
      data: sentNotifications
    });

    res.json({
      message: 'Notification sent successfully',
      recipientCount: users.length
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
};
