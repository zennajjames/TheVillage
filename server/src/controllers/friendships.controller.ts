import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { emailService } from '../services/email.service';

export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const requesterId = req.user!.id;
    const { addresseeId } = req.body;

    if (!addresseeId) {
      return res.status(400).json({ error: 'Addressee ID required' });
    }

    if (requesterId === addresseeId) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }

    // Check if friendship already exists
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, addresseeId },
          { requesterId: addresseeId, addresseeId: requesterId }
        ]
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Friend request already exists' });
    }

    // Get users for notification
    const [requester, addressee] = await Promise.all([
      prisma.user.findUnique({ where: { id: requesterId } }),
      prisma.user.findUnique({ where: { id: addresseeId } })
    ]);

    const friendship = await prisma.friendship.create({
      data: {
        requesterId,
        addresseeId,
        status: 'PENDING'
      },
      include: {
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true
          }
        },
        addressee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true
          }
        }
      }
    });

    // Send email notification
    if (addressee && addressee.emailNotifications && requester) {
      emailService.sendFriendRequestNotification(
        addressee.email,
        addressee.firstName,
        requester.firstName + ' ' + requester.lastName,
        friendship.id
      ).catch(err => console.error('Failed to send email:', err));
    }

    res.status(201).json(friendship);
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({ error: 'Failed to send friend request' });
  }
};

export const respondToFriendRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { friendshipId } = req.params;
    const { status } = req.body; // 'ACCEPTED' or 'REJECTED'

    if (status !== 'ACCEPTED' && status !== 'REJECTED') {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId }
    });

    if (!friendship) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    if (friendship.addresseeId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedFriendship = await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status },
      include: {
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            location: true
          }
        },
        addressee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            location: true
          }
        }
      }
    });

    res.json(updatedFriendship);
  } catch (error) {
    console.error('Respond to friend request error:', error);
    res.status(500).json({ error: 'Failed to respond to friend request' });
  }
};

export const getFriends = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: userId, status: 'ACCEPTED' },
          { addresseeId: userId, status: 'ACCEPTED' }
        ]
      },
      include: {
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            location: true
          }
        },
        addressee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            location: true
          }
        }
      }
    });

    // Format to return the other person in the friendship
    const friends = friendships.map(f => {
      const friend = f.requesterId === userId ? f.addressee : f.requester;
      return {
        friendshipId: f.id,
        friend
      };
    });

    res.json(friends);
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
};

export const getPendingRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const requests = await prisma.friendship.findMany({
      where: {
        addresseeId: userId,
        status: 'PENDING'
      },
      include: {
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            location: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(requests);
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ error: 'Failed to fetch pending requests' });
  }
};

export const removeFriend = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { friendshipId } = req.params;

    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId }
    });

    if (!friendship) {
      return res.status(404).json({ error: 'Friendship not found' });
    }

    // Can only remove if you're part of the friendship
    if (friendship.requesterId !== userId && friendship.addresseeId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.friendship.delete({
      where: { id: friendshipId }
    });

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ error: 'Failed to remove friend' });
  }
};

export const getFriendshipStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { otherUserId } = req.params;

    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, addresseeId: otherUserId },
          { requesterId: otherUserId, addresseeId: userId }
        ]
      }
    });

    if (!friendship) {
      return res.json({ status: 'NONE', friendshipId: null });
    }

    res.json({ 
      status: friendship.status, 
      friendshipId: friendship.id,
      isRequester: friendship.requesterId === userId
    });
  } catch (error) {
    console.error('Get friendship status error:', error);
    res.status(500).json({ error: 'Failed to check friendship status' });
  }
};