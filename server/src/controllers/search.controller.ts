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

    // Split search term into words for multi-word name matching
    const searchWords = searchTerm.split(/\s+/).filter(w => w.length > 0);

    // Search users - match individual fields OR all words match across firstName/lastName
    // Only include users who have opted in to appearing in search results
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: userId } }, // Exclude current user
          { appearInSearch: true }, // Respect privacy setting
          searchWords.length > 1
            ? {
                // Multi-word search: every word must match either firstName or lastName
                AND: searchWords.map(word => ({
                  OR: [
                    { firstName: { contains: word, mode: 'insensitive' as const } },
                    { lastName: { contains: word, mode: 'insensitive' as const } },
                  ]
                }))
              }
            : {
                OR: [
                  { firstName: { contains: searchTerm, mode: 'insensitive' } },
                  { lastName: { contains: searchTerm, mode: 'insensitive' } },
                  { location: { contains: searchTerm, mode: 'insensitive' } },
                  { email: { contains: searchTerm, mode: 'insensitive' } },
                  { zipCode: { contains: searchTerm, mode: 'insensitive' } }
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

    // Search communities
    const communities = await prisma.community.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { location: { contains: searchTerm, mode: 'insensitive' } },
          { category: { contains: searchTerm, mode: 'insensitive' } }
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
          select: { members: true, communityPosts: true }
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
        communities: communities.map(c => ({ ...c, type: 'community' })),
        messages: formattedMessages.map(m => ({ ...m, type: 'message' }))
      },
      counts: {
        users: users.length,
        posts: posts.length,
        communities: communities.length,
        messages: messages.length,
        total: users.length + posts.length + communities.length + messages.length
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};
