import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { emailService } from '../services/email.service';
import { notificationService } from '../services/notification.service';


export const createPost = async (req: Request, res: Response) => {
  try {
    const { type, title, description, location, communityId } = req.body;
    const userId = req.user!.id;

    if (!type || !title || !description || !location || !communityId) {
      return res.status(400).json({ error: 'All fields are required including communityId' });
    }

    if (type !== 'REQUEST' && type !== 'OFFER') {
      return res.status(400).json({ error: 'Type must be REQUEST or OFFER' });
    }

    // Verify user is a member of the community
    const membership = await prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId } }
    });
    if (!membership) {
      return res.status(403).json({ error: 'You must be a member of this community to post' });
    }

    const post = await prisma.post.create({
      data: {
        userId,
        communityId,
        type,
        title,
        description,
        location,
        status: 'OPEN'
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            location: true,
            profilePicture: true,
            zipCode: true
          }
        },
        community: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Get community members to notify (not the poster)
    const communityMembers = await prisma.communityMember.findMany({
      where: {
        communityId,
        userId: { not: userId }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            emailNotifications: true,
            notifyOnPosts: true
          }
        }
      },
      take: 50
    });

    const posterName = post.user.firstName + ' ' + post.user.lastName;

    // Send notifications async
    communityMembers.forEach(({ user }) => {
      // Create in-app notification
      notificationService.notifyNewPost(
        user.id,
        post.id,
        type,
        title,
        posterName,
        location
      ).catch(err => console.error('Failed to create notification:', err));

      // Send email if enabled
      if (user.emailNotifications && user.notifyOnPosts) {
        emailService.sendNewPostNotification(
          user.email,
          user.firstName,
          type,
          title,
          description,
          posterName,
          location,
          post.id
        ).catch(err => console.error('Failed to send email:', err));
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { type, status, communityId } = req.query;

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    } else {
      where.status = 'OPEN';
    }

    if (communityId && typeof communityId === 'string') {
      where.communityId = communityId;
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        user: {
            select: {
            id: true,
            firstName: true,
            lastName: true,
            location: true,
            profilePicture: true
            }
        },
        community: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
        include: {
            user: {
                select: {
                id: true,
                firstName: true,
                lastName: true,
                location: true,
                email: true,
                profilePicture: true
                }
            },
            community: {
              select: {
                id: true,
                name: true
              }
            }
        }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

export const updatePostStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user!.id;

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            location: true
          }
        },
        community: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json(updatedPost);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await prisma.post.delete({
      where: { id }
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
