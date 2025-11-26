import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { emailService } from '../services/email.service';


export const createPost = async (req: Request, res: Response) => {
  try {
    const { type, title, description, location } = req.body;
    const userId = req.user!.id;

    if (!type || !title || !description || !location) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (type !== 'REQUEST' && type !== 'OFFER') {
      return res.status(400).json({ error: 'Type must be REQUEST or OFFER' });
    }

    const post = await prisma.post.create({
      data: {
        userId,
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
        }
      }
    });

    // Get nearby users (same zip code) to notify
    const nearbyUsers = await prisma.user.findMany({
      where: {
        zipCode: post.user.zipCode,
        id: { not: userId },
        emailNotifications: true,
        notifyOnPosts: true
      },
      select: {
        email: true,
        firstName: true
      },
      take: 50 // Limit to avoid sending too many emails
    });

    // Send notifications async
    nearbyUsers.forEach(user => {
      emailService.sendNewPostNotification(
        user.email,
        user.firstName,
        type,
        title,
        description,
        post.user.firstName + ' ' + post.user.lastName,
        location,
        post.id
      ).catch(err => console.error('Failed to send email:', err));
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { type, status } = req.query;

    const where: any = {};
    
    if (type) {
      where.type = type;
    }
    
    if (status) {
      where.status = status;
    } else {
      where.status = 'OPEN';
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
            profilePicture: true  // Add this line
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
                profilePicture: true  // Add this line
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