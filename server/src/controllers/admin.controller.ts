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
            communityMemberships: true
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
        },
        community: {
          select: {
            id: true,
            name: true
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

export const getAllCommunities = async (req: Request, res: Response) => {
  try {
    const communities = await prisma.community.findMany({
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
            communityPosts: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(communities);
  } catch (error) {
    console.error('Get all communities error:', error);
    res.status(500).json({ error: 'Failed to fetch communities' });
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

export const deleteCommunityAsAdmin = async (req: Request, res: Response) => {
  try {
    const { communityId } = req.params;

    await prisma.community.delete({
      where: { id: communityId }
    });

    res.json({ message: 'Community deleted successfully' });
  } catch (error) {
    console.error('Delete community error:', error);
    res.status(500).json({ error: 'Failed to delete community' });
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

export const updateCommunityAsAdmin = async (req: Request, res: Response) => {
  try {
    const { communityId } = req.params;
    const { name, description, category, isPrivate } = req.body;

    const community = await prisma.community.update({
      where: { id: communityId },
      data: {
        name: name ?? undefined,
        description: description ?? undefined,
        category: category ?? undefined,
        isPrivate: isPrivate ?? undefined
      }
    });

    res.json(community);
  } catch (error) {
    console.error('Update community error:', error);
    res.status(500).json({ error: 'Failed to update community' });
  }
};

// ===== Event Admin Endpoints =====

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        community: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(events);
  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const getPendingEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      where: { status: 'PENDING_REVIEW' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        community: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(events);
  } catch (error) {
    console.error('Get pending events error:', error);
    res.status(500).json({ error: 'Failed to fetch pending events' });
  }
};

export const reviewEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { status, adminNotes } = req.body;

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Status must be APPROVED or REJECTED' });
    }

    const event = await prisma.event.update({
      where: { id: eventId },
      data: {
        status,
        adminNotes: adminNotes || null
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
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

    res.json(event);
  } catch (error) {
    console.error('Review event error:', error);
    res.status(500).json({ error: 'Failed to review event' });
  }
};

export const deleteEventAsAdmin = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    await prisma.event.delete({
      where: { id: eventId }
    });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};
