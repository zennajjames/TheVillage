import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { notificationService } from '../services/notification.service';

// Helper: check if user is admin/moderator in a community
async function getUserCommunityRole(userId: string, communityId: string) {
  const membership = await prisma.communityMember.findUnique({
    where: { communityId_userId: { communityId, userId } },
  });
  return membership?.role || null;
}

// Sanitize user info based on visibility and viewer role
function sanitizeUser(helpRequest: any, viewerRole: string | null) {
  const isAdminOrMod = viewerRole === 'ADMIN' || viewerRole === 'MODERATOR';

  if (helpRequest.visibility === 'PUBLIC') {
    return helpRequest;
  }

  if (helpRequest.visibility === 'SEMI_ANONYMOUS') {
    if (isAdminOrMod) {
      return { ...helpRequest, isAnonymousToPublic: true };
    }
    return {
      ...helpRequest,
      user: null,
      userId: null,
      isAnonymousToPublic: true,
    };
  }

  // ADMIN_ONLY — should only be returned to admins, but double-check
  if (isAdminOrMod) {
    return helpRequest;
  }
  return null;
}

// POST / — Create a help request
export const createHelpRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { communityId, title, description, category, visibility } = req.body;

    if (!communityId || !title || !description || !category) {
      return res.status(400).json({ error: 'communityId, title, description, and category are required' });
    }

    const validVisibilities = ['PUBLIC', 'SEMI_ANONYMOUS', 'ADMIN_ONLY'];
    if (visibility && !validVisibilities.includes(visibility)) {
      return res.status(400).json({ error: 'visibility must be PUBLIC, SEMI_ANONYMOUS, or ADMIN_ONLY' });
    }

    // Verify user is a member of the community
    const membership = await prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId } },
    });

    if (!membership) {
      return res.status(403).json({ error: 'You must be a member of this community to request help' });
    }

    const helpRequest = await prisma.helpRequest.create({
      data: {
        communityId,
        userId,
        title,
        description,
        category,
        visibility: visibility || 'PUBLIC',
        status: 'OPEN',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
        community: {
          select: { id: true, name: true },
        },
      },
    });

    // If ADMIN_ONLY, notify community admins
    if (helpRequest.visibility === 'ADMIN_ONLY') {
      const admins = await prisma.communityMember.findMany({
        where: {
          communityId,
          role: { in: ['ADMIN', 'MODERATOR'] },
          userId: { not: userId },
        },
        select: { userId: true },
      });

      for (const admin of admins) {
        notificationService.createNotification({
          userId: admin.userId,
          type: 'HELP_REQUEST',
          title: 'Private Help Request',
          message: `A community member in ${helpRequest.community.name} needs help: "${title}"`,
          actionUrl: `/communities/${communityId}?tab=admin-inbox`,
        }).catch(err => console.error('Failed to notify admin:', err));
      }
    }

    res.status(201).json(helpRequest);
  } catch (error) {
    console.error('Create help request error:', error);
    res.status(500).json({ error: 'Failed to create help request' });
  }
};

// GET /community/:communityId — Get help requests for a community (visibility-filtered)
export const getCommunityHelpRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { communityId } = req.params;
    const { status } = req.query;

    const viewerRole = await getUserCommunityRole(userId, communityId);
    if (!viewerRole) {
      return res.status(403).json({ error: 'You must be a member of this community' });
    }

    const isAdminOrMod = viewerRole === 'ADMIN' || viewerRole === 'MODERATOR';

    const where: any = {
      communityId,
      status: (status as string) || 'OPEN',
    };

    // Non-admins can't see ADMIN_ONLY requests
    if (!isAdminOrMod) {
      where.visibility = { in: ['PUBLIC', 'SEMI_ANONYMOUS'] };
    }

    const helpRequests = await prisma.helpRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
        community: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Sanitize based on visibility
    const sanitized = helpRequests
      .map(hr => sanitizeUser(hr, viewerRole))
      .filter(Boolean);

    res.json(sanitized);
  } catch (error) {
    console.error('Get community help requests error:', error);
    res.status(500).json({ error: 'Failed to fetch help requests' });
  }
};

// GET /admin/:communityId — Admin inbox (ADMIN_ONLY requests)
export const getAdminInbox = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { communityId } = req.params;

    const role = await getUserCommunityRole(userId, communityId);
    if (role !== 'ADMIN' && role !== 'MODERATOR') {
      return res.status(403).json({ error: 'Admin or moderator access required' });
    }

    const helpRequests = await prisma.helpRequest.findMany({
      where: {
        communityId,
        visibility: 'ADMIN_ONLY',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
        community: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(helpRequests);
  } catch (error) {
    console.error('Get admin inbox error:', error);
    res.status(500).json({ error: 'Failed to fetch admin inbox' });
  }
};

// GET /:id — Get single help request
export const getHelpRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
        community: {
          select: { id: true, name: true },
        },
      },
    });

    if (!helpRequest) {
      return res.status(404).json({ error: 'Help request not found' });
    }

    const viewerRole = await getUserCommunityRole(userId, helpRequest.communityId);
    const sanitized = sanitizeUser(helpRequest, viewerRole);

    if (!sanitized) {
      return res.status(403).json({ error: 'You do not have access to this request' });
    }

    res.json(sanitized);
  } catch (error) {
    console.error('Get help request error:', error);
    res.status(500).json({ error: 'Failed to fetch help request' });
  }
};

// PATCH /:id/status — Update help request status
export const updateHelpRequestStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['OPEN', 'IN_PROGRESS', 'FULFILLED', 'CLOSED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const helpRequest = await prisma.helpRequest.findUnique({ where: { id } });
    if (!helpRequest) {
      return res.status(404).json({ error: 'Help request not found' });
    }

    // Allow the requester or community admins to update status
    const isOwner = helpRequest.userId === userId;
    const role = await getUserCommunityRole(userId, helpRequest.communityId);
    const isAdminOrMod = role === 'ADMIN' || role === 'MODERATOR';

    if (!isOwner && !isAdminOrMod) {
      return res.status(403).json({ error: 'Not authorized to update this request' });
    }

    const updated = await prisma.helpRequest.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
          },
        },
        community: {
          select: { id: true, name: true },
        },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update help request status error:', error);
    res.status(500).json({ error: 'Failed to update help request' });
  }
};

// POST /:id/proxy — Admin creates an anonymous public version of an ADMIN_ONLY request
export const createProxyPost = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id },
      include: { community: { select: { id: true, name: true } } },
    });

    if (!helpRequest) {
      return res.status(404).json({ error: 'Help request not found' });
    }

    if (helpRequest.visibility !== 'ADMIN_ONLY') {
      return res.status(400).json({ error: 'Only ADMIN_ONLY requests can be proxied' });
    }

    if (helpRequest.proxyPostId) {
      return res.status(400).json({ error: 'This request has already been shared anonymously' });
    }

    const role = await getUserCommunityRole(userId, helpRequest.communityId);
    if (role !== 'ADMIN' && role !== 'MODERATOR') {
      return res.status(403).json({ error: 'Admin or moderator access required' });
    }

    // Create a SEMI_ANONYMOUS version that's visible to the community
    const proxyRequest = await prisma.helpRequest.create({
      data: {
        communityId: helpRequest.communityId,
        userId: helpRequest.userId,
        title: helpRequest.title,
        description: req.body.description || helpRequest.description,
        category: helpRequest.category,
        visibility: 'SEMI_ANONYMOUS',
        status: 'OPEN',
      },
      include: {
        community: { select: { id: true, name: true } },
      },
    });

    // Link the original to the proxy
    await prisma.helpRequest.update({
      where: { id },
      data: { proxyPostId: proxyRequest.id },
    });

    res.status(201).json(proxyRequest);
  } catch (error) {
    console.error('Create proxy post error:', error);
    res.status(500).json({ error: 'Failed to create proxy post' });
  }
};

// DELETE /:id — Delete help request
export const deleteHelpRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const helpRequest = await prisma.helpRequest.findUnique({ where: { id } });
    if (!helpRequest) {
      return res.status(404).json({ error: 'Help request not found' });
    }

    const isOwner = helpRequest.userId === userId;
    const role = await getUserCommunityRole(userId, helpRequest.communityId);
    const isAdminOrMod = role === 'ADMIN' || role === 'MODERATOR';

    if (!isOwner && !isAdminOrMod) {
      return res.status(403).json({ error: 'Not authorized to delete this request' });
    }

    await prisma.helpRequest.delete({ where: { id } });
    res.json({ message: 'Help request deleted successfully' });
  } catch (error) {
    console.error('Delete help request error:', error);
    res.status(500).json({ error: 'Failed to delete help request' });
  }
};
