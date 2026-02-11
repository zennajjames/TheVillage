import { Router } from 'express';
import {
  getAllUsers,
  getAllPosts,
  getAllCommunities,
  deleteUserAsAdmin,
  deletePostAsAdmin,
  deleteCommunityAsAdmin,
  updatePostAsAdmin,
  updateCommunityAsAdmin,
  getAllEvents,
  getPendingEvents,
  reviewEvent,
  deleteEventAsAdmin
} from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = Router();

// All admin routes require authentication AND admin status
router.use(authenticate);
router.use(requireAdmin);

router.get('/users', getAllUsers);
router.get('/posts', getAllPosts);
router.get('/communities', getAllCommunities);

router.delete('/users/:userId', deleteUserAsAdmin);
router.delete('/posts/:postId', deletePostAsAdmin);
router.delete('/communities/:communityId', deleteCommunityAsAdmin);

router.patch('/posts/:postId', updatePostAsAdmin);
router.patch('/communities/:communityId', updateCommunityAsAdmin);

// Event admin routes
router.get('/events', getAllEvents);
router.get('/events/pending', getPendingEvents);
router.patch('/events/:eventId/review', reviewEvent);
router.delete('/events/:eventId', deleteEventAsAdmin);

export default router;
