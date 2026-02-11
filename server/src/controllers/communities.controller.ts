import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { notificationService } from '../services/notification.service';

const prisma = new PrismaClient();

// Get all communities
export const getAllCommunities = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { category } = req.query;

    const where: any = {};
    if (category) {
      where.category = category as string;
    }

    const communities = await prisma.community.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
        _count: {
          select: {
            members: true,
            communityPosts: true,
          },
        },
        members: userId
          ? {
              where: { userId },
              select: { id: true, role: true },
            }
          : false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Look up join requests for the current user
    let userJoinRequests: { communityId: string; id: string; status: string }[] = [];
    if (userId) {
      userJoinRequests = await prisma.joinRequest.findMany({
        where: { userId },
        select: { communityId: true, id: true, status: true },
      });
    }

    const joinRequestMap = new Map(
      userJoinRequests.map((jr) => [jr.communityId, jr])
    );

    // Add isMember and userRole to each community
    const communitiesWithStatus = communities.map((community) => {
      const jr = joinRequestMap.get(community.id);
      return {
        ...community,
        isMember: community.members && community.members.length > 0,
        userRole: community.members && community.members.length > 0 ? community.members[0].role : null,
        joinRequestStatus: jr ? jr.status : null,
        joinRequestId: jr ? jr.id : null,
        members: undefined, // Remove members array from response
      };
    });

    res.json(communitiesWithStatus);
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ error: 'Failed to fetch communities' });
  }
};

// Get communities user is a member of
export const getUserCommunities = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const memberships = await prisma.communityMember.findMany({
      where: { userId },
      include: {
        community: {
          include: {
            createdBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicture: true,
              },
            },
            _count: {
              select: {
                members: true,
                communityPosts: true,
              },
            },
          },
        },
      },
      orderBy: {
        joinedAt: 'desc',
      },
    });

    const communities = memberships.map((membership) => ({
      ...membership.community,
      isMember: true,
      userRole: membership.role,
    }));

    res.json(communities);
  } catch (error) {
    console.error('Error fetching user communities:', error);
    res.status(500).json({ error: 'Failed to fetch user communities' });
  }
};

// Get single community by ID
export const getCommunityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const community = await prisma.community.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicture: true,
                location: true,
              },
            },
          },
          orderBy: {
            joinedAt: 'asc',
          },
        },
        communityPosts: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        subGroups: {
          include: {
            _count: {
              select: {
                members: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            members: true,
            communityPosts: true,
            subGroups: true,
          },
        },
      },
    });

    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    // Check if user is a member
    const userMembership = userId
      ? community.members.find((m) => m.userId === userId)
      : null;

    // Check for join request
    let joinRequestStatus: string | null = null;
    let joinRequestId: string | null = null;
    if (userId && !userMembership) {
      const joinRequest = await prisma.joinRequest.findUnique({
        where: { communityId_userId: { communityId: id, userId } },
      });
      if (joinRequest) {
        joinRequestStatus = joinRequest.status;
        joinRequestId = joinRequest.id;
      }
    }

    const communityWithStatus = {
      ...community,
      isMember: !!userMembership,
      userRole: userMembership?.role || null,
      joinRequestStatus,
      joinRequestId,
    };

    res.json(communityWithStatus);
  } catch (error) {
    console.error('Error fetching community:', error);
    res.status(500).json({ error: 'Failed to fetch community' });
  }
};

// Create a new community
export const createCommunity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, description, location, address, zipCode, isPrivate, coverImage, category } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const community = await prisma.community.create({
      data: {
        name,
        description,
        location,
        address,
        zipCode,
        isPrivate: isPrivate || false,
        coverImage,
        category: category || null,
        createdById: userId,
        members: {
          create: {
            userId,
            role: 'ADMIN',
          },
        },
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
        _count: {
          select: {
            members: true,
            communityPosts: true,
          },
        },
      },
    });

    res.status(201).json({
      ...community,
      isMember: true,
      userRole: 'ADMIN',
    });
  } catch (error) {
    console.error('Error creating community:', error);
    res.status(500).json({ error: 'Failed to create community' });
  }
};

// Update a community
export const updateCommunity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { name, description, location, address, zipCode, isPrivate, coverImage, category } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user is admin
    const membership = await prisma.communityMember.findFirst({
      where: {
        communityId: id,
        userId,
        role: 'ADMIN',
      },
    });

    if (!membership) {
      return res.status(403).json({ error: 'You must be an admin to update this community' });
    }

    const community = await prisma.community.update({
      where: { id },
      data: {
        name,
        description,
        location,
        address,
        zipCode,
        isPrivate,
        coverImage,
        category,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
        _count: {
          select: {
            members: true,
            communityPosts: true,
          },
        },
      },
    });

    res.json({
      ...community,
      isMember: true,
      userRole: 'ADMIN',
    });
  } catch (error) {
    console.error('Error updating community:', error);
    res.status(500).json({ error: 'Failed to update community' });
  }
};

// Delete a community
export const deleteCommunity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user is admin
    const membership = await prisma.communityMember.findFirst({
      where: {
        communityId: id,
        userId,
        role: 'ADMIN',
      },
    });

    if (!membership) {
      return res.status(403).json({ error: 'You must be an admin to delete this community' });
    }

    await prisma.community.delete({
      where: { id },
    });

    res.json({ message: 'Community deleted successfully' });
  } catch (error) {
    console.error('Error deleting community:', error);
    res.status(500).json({ error: 'Failed to delete community' });
  }
};

// Join a community
export const joinCommunity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { message } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if already a member of this specific community
    const existingMembership = await prisma.communityMember.findUnique({
      where: {
        communityId_userId: {
          communityId: id,
          userId,
        },
      },
    });

    if (existingMembership) {
      return res.status(400).json({ error: 'Already a member of this community' });
    }

    // Check if community exists
    const community = await prisma.community.findUnique({
      where: { id },
    });

    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    // Check if there's already a pending join request
    const existingRequest = await prisma.joinRequest.findUnique({
      where: {
        communityId_userId: {
          communityId: id,
          userId,
        },
      },
    });

    if (existingRequest && existingRequest.status === 'PENDING') {
      return res.status(400).json({ error: 'You already have a pending join request for this community' });
    }

    // Create or update join request
    const joinRequest = existingRequest
      ? await prisma.joinRequest.update({
          where: { id: existingRequest.id },
          data: { status: 'PENDING', message: message || null },
        })
      : await prisma.joinRequest.create({
          data: {
            communityId: id,
            userId,
            status: 'PENDING',
            message: message || null,
          },
        });

    // Notify community admins
    const admins = await prisma.communityMember.findMany({
      where: { communityId: id, role: 'ADMIN' },
      select: { userId: true },
    });

    const requester = await prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true, lastName: true },
    });

    const requesterName = requester ? `${requester.firstName} ${requester.lastName}` : 'Someone';

    for (const admin of admins) {
      await notificationService.notifyJoinRequest(
        admin.userId,
        userId,
        requesterName,
        id,
        community.name
      );
    }

    res.status(201).json({ joinRequest });
  } catch (error) {
    console.error('Error requesting to join community:', error);
    res.status(500).json({ error: 'Failed to submit join request' });
  }
};

// Get pending join requests for a community (admin only)
export const getJoinRequests = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify caller is admin of this community
    const membership = await prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId: id, userId } },
    });

    if (!membership || membership.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only community admins can view join requests' });
    }

    const joinRequests = await prisma.joinRequest.findMany({
      where: { communityId: id, status: 'PENDING' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            location: true,
            bio: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json(joinRequests);
  } catch (error) {
    console.error('Error fetching join requests:', error);
    res.status(500).json({ error: 'Failed to fetch join requests' });
  }
};

// Approve or deny a join request (admin only)
export const respondToJoinRequest = async (req: Request, res: Response) => {
  try {
    const { id, requestId } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!['APPROVED', 'DENIED'].includes(status)) {
      return res.status(400).json({ error: 'Status must be APPROVED or DENIED' });
    }

    // Verify caller is admin
    const membership = await prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId: id, userId } },
    });

    if (!membership || membership.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only community admins can respond to join requests' });
    }

    // Find the join request
    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id: requestId },
      include: { community: { select: { name: true } } },
    });

    if (!joinRequest || joinRequest.communityId !== id) {
      return res.status(404).json({ error: 'Join request not found' });
    }

    if (joinRequest.status !== 'PENDING') {
      return res.status(400).json({ error: 'This request has already been processed' });
    }

    if (status === 'APPROVED') {
      // Create membership and update request
      await prisma.$transaction([
        prisma.joinRequest.update({
          where: { id: requestId },
          data: { status: 'APPROVED' },
        }),
        prisma.communityMember.create({
          data: {
            communityId: id,
            userId: joinRequest.userId,
            role: 'MEMBER',
          },
        }),
      ]);

      await notificationService.notifyJoinRequestApproved(
        joinRequest.userId,
        id,
        joinRequest.community.name
      );
    } else {
      // Deny: delete the request so they can re-request later
      await prisma.joinRequest.delete({
        where: { id: requestId },
      });

      await notificationService.notifyJoinRequestDenied(
        joinRequest.userId,
        id,
        joinRequest.community.name
      );
    }

    res.json({ message: `Join request ${status.toLowerCase()}` });
  } catch (error) {
    console.error('Error responding to join request:', error);
    res.status(500).json({ error: 'Failed to respond to join request' });
  }
};

// Cancel a pending join request (user)
export const cancelJoinRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const joinRequest = await prisma.joinRequest.findUnique({
      where: { communityId_userId: { communityId: id, userId } },
    });

    if (!joinRequest || joinRequest.status !== 'PENDING') {
      return res.status(404).json({ error: 'No pending join request found' });
    }

    await prisma.joinRequest.delete({
      where: { id: joinRequest.id },
    });

    res.json({ message: 'Join request cancelled' });
  } catch (error) {
    console.error('Error cancelling join request:', error);
    res.status(500).json({ error: 'Failed to cancel join request' });
  }
};

// Leave a community
export const leaveCommunity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const membership = await prisma.communityMember.findUnique({
      where: {
        communityId_userId: {
          communityId: id,
          userId,
        },
      },
    });

    if (!membership) {
      return res.status(404).json({ error: 'Not a member of this community' });
    }

    // Prevent leaving if user is the only admin
    if (membership.role === 'ADMIN') {
      const adminCount = await prisma.communityMember.count({
        where: {
          communityId: id,
          role: 'ADMIN',
        },
      });

      if (adminCount === 1) {
        return res.status(400).json({ error: 'You are the only admin. Please assign another admin before leaving.' });
      }
    }

    await prisma.communityMember.delete({
      where: {
        communityId_userId: {
          communityId: id,
          userId,
        },
      },
    });

    res.json({ message: 'Left community successfully' });
  } catch (error) {
    console.error('Error leaving community:', error);
    res.status(500).json({ error: 'Failed to leave community' });
  }
};

// Update member role
export const updateMemberRole = async (req: Request, res: Response) => {
  try {
    const { id, memberId } = req.params;
    const userId = req.user?.id;
    const { role } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if requester is admin
    const requesterMembership = await prisma.communityMember.findFirst({
      where: {
        communityId: id,
        userId,
        role: 'ADMIN',
      },
    });

    if (!requesterMembership) {
      return res.status(403).json({ error: 'You must be an admin to update member roles' });
    }

    const membership = await prisma.communityMember.update({
      where: { id: memberId },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            location: true,
          },
        },
      },
    });

    res.json(membership);
  } catch (error) {
    console.error('Error updating member role:', error);
    res.status(500).json({ error: 'Failed to update member role' });
  }
};

// Remove member from community
export const removeMember = async (req: Request, res: Response) => {
  try {
    const { id, memberId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if requester is admin
    const requesterMembership = await prisma.communityMember.findFirst({
      where: {
        communityId: id,
        userId,
        role: 'ADMIN',
      },
    });

    if (!requesterMembership) {
      return res.status(403).json({ error: 'You must be an admin to remove members' });
    }

    await prisma.communityMember.delete({
      where: { id: memberId },
    });

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
};

// Create a post within a community
export const createCommunityPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { content } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Check membership
    const membership = await prisma.communityMember.findUnique({
      where: {
        communityId_userId: {
          communityId: id,
          userId,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({ error: 'You must be a member to post in this community' });
    }

    const post = await prisma.communityPost.create({
      data: {
        communityId: id,
        userId,
        content,
        images: [],
      },
    });

    // Notify other community members
    const community = await prisma.community.findUnique({
      where: { id },
      select: { name: true },
    });

    if (community) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true },
      });

      if (user) {
        await notificationService.notifyCommunityPost(
          id,
          community.name,
          userId,
          `${user.firstName} ${user.lastName}`
        );
      }
    }

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating community post:', error);
    res.status(500).json({ error: 'Failed to create community post' });
  }
};
