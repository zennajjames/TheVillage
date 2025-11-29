import { Router } from 'express';
import {
  getAllUsers,
  getAllPosts,
  getAllGroups,
  deleteUserAsAdmin,
  deletePostAsAdmin,
  deleteGroupAsAdmin,
  updatePostAsAdmin,
  updateGroupAsAdmin
} from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = Router();

// All admin routes require authentication AND admin status
router.use(authenticate);
router.use(requireAdmin);

router.get('/users', getAllUsers);
router.get('/posts', getAllPosts);
router.get('/groups', getAllGroups);

router.delete('/users/:userId', deleteUserAsAdmin);
router.delete('/posts/:postId', deletePostAsAdmin);
router.delete('/groups/:groupId', deleteGroupAsAdmin);

router.patch('/posts/:postId', updatePostAsAdmin);
router.patch('/groups/:groupId', updateGroupAsAdmin);

export default router;