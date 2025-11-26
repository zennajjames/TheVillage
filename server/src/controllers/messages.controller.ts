import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { emailService } from '../services/email.service';


export const getConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId
          }
        }
      },
      include: {
        participants: {
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
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Format conversations to show other participant
    const formattedConversations = conversations.map(conv => {
      const otherParticipant = conv.participants.find(p => p.userId !== userId);
      const lastMessage = conv.messages[0];
      
      return {
        id: conv.id,
        otherUser: otherParticipant?.user,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          senderId: lastMessage.senderId,
          createdAt: lastMessage.createdAt,
          isRead: lastMessage.isRead
        } : null,
        updatedAt: conv.updatedAt
      };
    });

    res.json(formattedConversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

export const getOrCreateConversation = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { otherUserId } = req.params;

    if (userId === otherUserId) {
      return res.status(400).json({ error: 'Cannot message yourself' });
    }

    // Check if conversation already exists
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: { userId }
            }
          },
          {
            participants: {
              some: { userId: otherUserId }
            }
          }
        ]
      },
      include: {
        participants: {
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
    });

    if (existingConversation) {
      return res.json(existingConversation);
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId },
            { userId: otherUserId }
          ]
        }
      },
      include: {
        participants: {
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
    });

    res.status(201).json(conversation);
  } catch (error) {
    console.error('Get/create conversation error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { conversationId } = req.params;

    // Verify user is participant
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: { userId }
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false
      },
      data: { isRead: true }
    });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content required' });
    }

    // Verify user is participant and get conversation details
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: { userId }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                emailNotifications: true,
                notifyOnMessages: true
              }
            }
          }
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        content: content.trim()
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true
          }
        }
      }
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    // Send email notification to other participant
    const otherParticipant = conversation.participants.find(p => p.userId !== userId);
    if (otherParticipant && 
        otherParticipant.user.emailNotifications && 
        otherParticipant.user.notifyOnMessages) {
      
      // Send async (don't wait for it)
      emailService.sendNewMessageNotification(
        otherParticipant.user.email,
        otherParticipant.user.firstName,
        message.sender.firstName + ' ' + message.sender.lastName,
        content.substring(0, 100),
        conversationId
      ).catch(err => console.error('Failed to send email:', err));
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};