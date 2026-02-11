import { Router } from 'express';
import {
  createEvent,
  getApprovedEvents,
  getEventById,
  getUserEvents,
  updateEvent,
  deleteEvent,
} from '../controllers/events.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All event routes require authentication
router.use(authenticate);

router.post('/', createEvent);
router.get('/', getApprovedEvents);
router.get('/mine', getUserEvents);
router.get('/:id', getEventById);
router.patch('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;
