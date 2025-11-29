import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const globalSearch = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const userId = req.user!.id;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query required' });
    }

    const searchTerm = query.trim();
    
    if (searchTerm.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    // Search users
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: userId } }, // Exclude current user
          {
            OR: [
              { firstName: { contains: searchTerm, mode: 'insensitive' } },
              { lastName: { contains: searchTerm, mode: 'insensitive' } },
              { location: { contains: searchTerm, mode: 'insensitive' } }
            ]
          }
        ]
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        location: true,
        bio: true
      },
      take: 10
    });

    // Search posts
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { location: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Search groups
    const groups = await prisma.group.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { category: { contains: searchTerm, mode: 'insensitive' } },
          { location: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        _count: {
          select: { members: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Search messages (only in user's conversations)
    const messages = await prisma.message.findMany({
      where: {
        AND: [
          { content: { contains: searchTerm, mode: 'insensitive' } },
          {
            conversation: {
              participants: {
                some: { userId }
              }
            }
          }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true
          }
        },
        conversation: {
          include: {
            participants: {
              where: { userId: { not: userId } },
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profilePicture: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Format messages to show the other participant
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      createdAt: msg.createdAt,
      sender: msg.sender,
      conversationId: msg.conversationId,
      otherUser: msg.conversation.participants[0]?.user || null
    }));

    res.json({
      query: searchTerm,
      results: {
        users: users.map(u => ({ ...u, type: 'user' })),
        posts: posts.map(p => ({ ...p, type: 'post' })),
        groups: groups.map(g => ({ ...g, type: 'group' })),
        messages: formattedMessages.map(m => ({ ...m, type: 'message' }))
      },
      counts: {
        users: users.length,
        posts: posts.length,
        groups: groups.length,
        messages: messages.length,
        total: users.length + posts.length + groups.length + messages.length
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};