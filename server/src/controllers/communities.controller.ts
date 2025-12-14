import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all communities
export const getAllCommunities = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const communities = await prisma.community.findMany({
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
            groups: true,
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

    // Add isMember and userRole to each community
    const communitiesWithStatus = communities.map((community) => ({
      ...community,
      isMember: community.members && community.members.length > 0,
      userRole: community.members && community.members.length > 0 ? community.members[0].role : null,
      members: undefined, // Remove members array from response
    }));

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
                groups: true,
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
        groups: {
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
                posts: true,
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
            groups: true,
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

    const communityWithStatus = {
      ...community,
      isMember: !!userMembership,
      userRole: userMembership?.role || null,
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
    const { name, description, location, address, zipCode, isPrivate, coverImage } = req.body;

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
            groups: true,
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
    const { name, description, location, address, zipCode, isPrivate, coverImage } = req.body;

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
            groups: true,
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

    // Check if community exists and is not private (or handle invitation logic)
    const community = await prisma.community.findUnique({
      where: { id },
    });

    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    if (community.isPrivate) {
      return res.status(403).json({ error: 'This community is private. You need an invitation to join.' });
    }

    const membership = await prisma.communityMember.create({
      data: {
        communityId: id,
        userId,
        role: 'MEMBER',
      },
    });

    res.status(201).json(membership);
  } catch (error) {
    console.error('Error joining community:', error);
    res.status(500).json({ error: 'Failed to join community' });
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
