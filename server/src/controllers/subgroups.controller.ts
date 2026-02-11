import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const createSubGroup = async (req: Request, res: Response) => {
  try {
    const { parentCommunityId, name, description, teacherName, grade } = req.body;
    const userId = req.user!.id;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Verify user is a member of the parent community
    const membership = await prisma.communityMember.findUnique({
      where: {
        communityId_userId: {
          communityId: parentCommunityId,
          userId
        }
      }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Must be a member of the parent community to create subgroups' });
    }

    const subGroup = await prisma.subGroup.create({
      data: {
        parentCommunityId,
        name,
        description: description || '',
        teacherName,
        grade,
        createdById: userId
      }
    });

    // Automatically add creator as a member
    await prisma.subGroupMember.create({
      data: {
        subGroupId: subGroup.id,
        userId
      }
    });

    res.status(201).json(subGroup);
  } catch (error) {
    console.error('Create subgroup error:', error);
    res.status(500).json({ error: 'Failed to create subgroup' });
  }
};

export const getSubGroups = async (req: Request, res: Response) => {
  try {
    const { parentCommunityId } = req.params;
    const userId = req.user!.id;

    // Verify user is a member of the parent community
    const membership = await prisma.communityMember.findUnique({
      where: {
        communityId_userId: {
          communityId: parentCommunityId,
          userId
        }
      }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Must be a member of the parent community to view subgroups' });
    }

    const subGroups = await prisma.subGroup.findMany({
      where: { parentCommunityId },
      include: {
        members: {
          where: { userId },
          select: { userId: true }
        },
        _count: {
          select: { members: true }
        }
      },
      orderBy: [
        { grade: 'asc' },
        { teacherName: 'asc' },
        { name: 'asc' }
      ]
    });

    // Add isMember flag to each subgroup
    const subGroupsWithMembership = subGroups.map(subGroup => ({
      ...subGroup,
      isMember: subGroup.members.length > 0,
      members: undefined // Remove members array from response
    }));

    res.json(subGroupsWithMembership);
  } catch (error) {
    console.error('Get subgroups error:', error);
    res.status(500).json({ error: 'Failed to fetch subgroups' });
  }
};

export const getSubGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const subGroup = await prisma.subGroup.findUnique({
      where: { id },
      include: {
        parentCommunity: {
          select: {
            id: true,
            name: true,
            members: {
              where: { userId },
              select: { userId: true }
            }
          }
        },
        members: {
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
        _count: {
          select: { members: true }
        }
      }
    });

    if (!subGroup) {
      return res.status(404).json({ error: 'Subgroup not found' });
    }

    // Verify user is a member of parent community
    if (subGroup.parentCommunity.members.length === 0) {
      return res.status(403).json({ error: 'Must be a member of the parent community' });
    }

    const isMember = subGroup.members.some(m => m.user.id === userId);

    res.json({ ...subGroup, isMember });
  } catch (error) {
    console.error('Get subgroup error:', error);
    res.status(500).json({ error: 'Failed to fetch subgroup' });
  }
};

export const joinSubGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if subgroup exists and user is member of parent community
    const subGroup = await prisma.subGroup.findUnique({
      where: { id },
      include: {
        parentCommunity: {
          select: {
            members: {
              where: { userId },
              select: { userId: true }
            }
          }
        }
      }
    });

    if (!subGroup) {
      return res.status(404).json({ error: 'Subgroup not found' });
    }

    if (subGroup.parentCommunity.members.length === 0) {
      return res.status(403).json({ error: 'Must be a member of the parent community to join subgroups' });
    }

    // Check if already a member
    const existingMember = await prisma.subGroupMember.findUnique({
      where: {
        subGroupId_userId: {
          subGroupId: id,
          userId
        }
      }
    });

    if (existingMember) {
      return res.status(400).json({ error: 'Already a member of this subgroup' });
    }

    const membership = await prisma.subGroupMember.create({
      data: {
        subGroupId: id,
        userId
      }
    });

    res.status(201).json(membership);
  } catch (error) {
    console.error('Join subgroup error:', error);
    res.status(500).json({ error: 'Failed to join subgroup' });
  }
};

export const leaveSubGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    await prisma.subGroupMember.delete({
      where: {
        subGroupId_userId: {
          subGroupId: id,
          userId
        }
      }
    });

    res.json({ message: 'Left subgroup successfully' });
  } catch (error) {
    console.error('Leave subgroup error:', error);
    res.status(500).json({ error: 'Failed to leave subgroup' });
  }
};

export const deleteSubGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const subGroup = await prisma.subGroup.findUnique({
      where: { id },
      select: { createdById: true }
    });

    if (!subGroup) {
      return res.status(404).json({ error: 'Subgroup not found' });
    }

    if (subGroup.createdById !== userId) {
      return res.status(403).json({ error: 'Only the creator can delete this subgroup' });
    }

    await prisma.subGroup.delete({
      where: { id }
    });

    res.json({ message: 'Subgroup deleted successfully' });
  } catch (error) {
    console.error('Delete subgroup error:', error);
    res.status(500).json({ error: 'Failed to delete subgroup' });
  }
};
