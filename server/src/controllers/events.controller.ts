import { Request, Response } from 'express';
import { prisma } from '../config/database';

// Create a new event (any authenticated user)
export const createEvent = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { title, description, location, address, zipCode, startDate, endDate, communityId } = req.body;

    if (!title || !description || !startDate || !endDate || !communityId) {
      return res.status(400).json({ error: 'Title, description, start date, end date, and community are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    if (end <= start) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    // Verify community exists
    const community = await prisma.community.findUnique({ where: { id: communityId } });
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    // Verify user is a member of the community
    const membership = await prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId } }
    });
    if (!membership) {
      return res.status(403).json({ error: 'You must be a member of this community to submit an event' });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        location: location || null,
        address: address || null,
        zipCode: zipCode || null,
        startDate: start,
        endDate: end,
        communityId,
        userId,
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
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// Get approved events (all authenticated users)
export const getApprovedEvents = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, communityId } = req.query;

    const where: any = {
      status: 'APPROVED',
    };

    if (startDate && typeof startDate === 'string') {
      where.startDate = { ...where.startDate, gte: new Date(startDate) };
    }
    if (endDate && typeof endDate === 'string') {
      where.endDate = { ...where.endDate, lte: new Date(endDate) };
    }
    if (communityId && typeof communityId === 'string') {
      where.communityId = communityId;
    }

    const events = await prisma.event.findMany({
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
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { startDate: 'asc' },
    });

    res.json(events);
  } catch (error) {
    console.error('Get approved events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Get single event by ID
export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const event = await prisma.event.findUnique({
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
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Non-admin users can only see approved events or their own events
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin && event.status !== 'APPROVED' && event.userId !== userId) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

// Get current user's events (all statuses)
export const getUserEvents = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const events = await prisma.event.findMany({
      where: { userId },
      include: {
        community: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(events);
  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({ error: 'Failed to fetch your events' });
  }
};

// Update own event (only if still pending)
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { title, description, location, address, zipCode, startDate, endDate, communityId } = req.body;

    const existingEvent = await prisma.event.findUnique({ where: { id } });

    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (existingEvent.userId !== userId) {
      return res.status(403).json({ error: 'You can only edit your own events' });
    }

    if (existingEvent.status !== 'PENDING_REVIEW') {
      return res.status(400).json({ error: 'You can only edit events that are pending review' });
    }

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (location !== undefined) data.location = location || null;
    if (address !== undefined) data.address = address || null;
    if (zipCode !== undefined) data.zipCode = zipCode || null;
    if (startDate !== undefined) data.startDate = new Date(startDate);
    if (endDate !== undefined) data.endDate = new Date(endDate);
    if (communityId !== undefined) data.communityId = communityId;

    const event = await prisma.event.update({
      where: { id },
      data,
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
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(event);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// Delete own event
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const existingEvent = await prisma.event.findUnique({ where: { id } });

    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (existingEvent.userId !== userId) {
      return res.status(403).json({ error: 'You can only delete your own events' });
    }

    await prisma.event.delete({ where: { id } });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};
