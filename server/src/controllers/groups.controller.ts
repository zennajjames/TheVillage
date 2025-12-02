import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { emailService } from '../services/email.service';
import { notificationService } from '../services/notification.service';


export const createGroup = async (req: Request, res: Response) => {
  try {
    const { communityId, name, description, category, isPrivate } = req.body;
    const userId = req.user!.id;

    if (!communityId || !name || !description || !category) {
      return res.status(400).json({ error: 'Community ID, name, description, and category are required' });
    }

    // Verify user is a member of the community
    const communityMember = await prisma.communityMember.findUnique({
      where: {
        communityId_userId: {
          communityId,
          userId
        }
      }
    });

    if (!communityMember) {
      return res.status(403).json({ error: 'You must be a member of the community to create a group' });
    }

    const group = await prisma.group.create({
      data: {
        communityId,
        name,
        description,
        category,
        isPrivate: isPrivate || false,
        createdById: userId,
        members: {
          create: {
            userId,
            role: 'ADMIN'
          }
        }
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true
          }
        },
        _count: {
          select: { members: true }
        }
      }
    });

    res.status(201).json(group);
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
};

export const getGroups = async (req: Request, res: Response) => {
  try {
    const { category, communityId } = req.query;
    const userId = req.user!.id;

    const where: any = {};

    if (communityId) {
      where.communityId = communityId;
    }

    if (category) {
      where.category = category;
    }

    const groups = await prisma.group.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true
          }
        },
        members: {
          where: { userId },
          select: { userId: true, role: true }
        },
        _count: {
          select: { members: true, posts: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Add isMember flag and user role to each group
    const groupsWithMembership = groups.map(group => ({
      ...group,
      isMember: group.members.length > 0,
      userRole: group.members.length > 0 ? group.members[0].role : null,
      members: undefined // Remove members array from response
    }));

    res.json(groupsWithMembership);
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
};

export const getGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            location: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicture: true,
                location: true
              }
            }
          },
          orderBy: {
            joinedAt: 'asc'
          }
        },
        posts: {
          include: {
            group: {
              select: {
                id: true,
                members: {
                  where: { userId },
                  select: { userId: true }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: { members: true, posts: true }
        }
      }
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if user is a member
    const isMember = group.members.some(m => m.userId === userId);
    const userMembership = group.members.find(m => m.userId === userId);

    res.json({ ...group, isMember, userRole: userMembership?.role || null });
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ error: 'Failed to fetch group' });
  }
};

export const joinGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if already a member
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: id,
          userId
        }
      }
    });

    if (existingMember) {
      return res.status(400).json({ error: 'Already a member of this group' });
    }

    const membership = await prisma.groupMember.create({
      data: {
        groupId: id,
        userId,
        role: 'MEMBER'
      },
      include: {
        group: {
          include: {
            _count: {
              select: { members: true }
            }
          }
        }
      }
    });

    res.status(201).json(membership);
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ error: 'Failed to join group' });
  }
};

export const leaveGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if user is the creator
    const group = await prisma.group.findUnique({
      where: { id },
      select: { createdById: true }
    });

    if (group?.createdById === userId) {
      return res.status(400).json({ error: 'Group creator cannot leave. Delete the group instead.' });
    }

    await prisma.groupMember.delete({
      where: {
        groupId_userId: {
          groupId: id,
          userId
        }
      }
    });

    res.json({ message: 'Left group successfully' });
  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({ error: 'Failed to leave group' });
  }
};

export const createGroupPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user!.id;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Check if user is a member and get group details
    const membership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: id,
          userId
        }
      }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Must be a member to post' });
    }

    // Get group and poster info
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        members: {
          where: {
            userId: { not: userId }
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                emailNotifications: true,
                notifyOnGroups: true
              }
            }
          }
        }
      }
    });

    const poster = await prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true, lastName: true }
    });

    const post = await prisma.groupPost.create({
      data: {
        groupId: id,
        userId,
        content
      }
    });

    // Send notifications to group members
    if (group && poster) {
      const posterName = poster.firstName + ' ' + poster.lastName;

      group.members.forEach(member => {
        // Create in-app notification
        notificationService.notifyGroupPost(
          member.user.id,
          id,
          group.name,
          posterName,
          content
        ).catch(err => console.error('Failed to create notification:', err));

        // Send email if enabled
        if (member.user.emailNotifications && member.user.notifyOnGroups) {
          emailService.sendGroupPostNotification(
            member.user.email,
            member.user.firstName,
            group.name,
            posterName,
            content,
            id
          ).catch(err => console.error('Failed to send email:', err));
        }
      });
    }

    res.status(201).json(post);
  } catch (error) {
    console.error('Create group post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const group = await prisma.group.findUnique({
      where: { id },
      select: { createdById: true }
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (group.createdById !== userId) {
      return res.status(403).json({ error: 'Only the creator can delete this group' });
    }

    await prisma.group.delete({
      where: { id }
    });

    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ error: 'Failed to delete group' });
  }
};