import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        location: true,
        isAdmin: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            groupMemberships: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
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
      orderBy: { createdAt: 'desc' }
    });

    res.json(posts);
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const getAllGroups = async (req: Request, res: Response) => {
  try {
    const groups = await prisma.group.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        _count: {
          select: {
            members: true,
            posts: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(groups);
  } catch (error) {
    console.error('Get all groups error:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
};

export const deleteUserAsAdmin = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const deletePostAsAdmin = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    await prisma.post.delete({
      where: { id: postId }
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

export const deleteGroupAsAdmin = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;

    await prisma.group.delete({
      where: { id: groupId }
    });

    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ error: 'Failed to delete group' });
  }
};

export const updatePostAsAdmin = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { title, description, status } = req.body;

    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        title: title ?? undefined,
        description: description ?? undefined,
        status: status ?? undefined
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json(post);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

export const updateGroupAsAdmin = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { name, description, category, isPrivate } = req.body;

    const group = await prisma.group.update({
      where: { id: groupId },
      data: {
        name: name ?? undefined,
        description: description ?? undefined,
        category: category ?? undefined,
        isPrivate: isPrivate ?? undefined
      }
    });

    res.json(group);
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({ error: 'Failed to update group' });
  }
};