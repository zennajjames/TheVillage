import { Router } from 'express';
import {
  createPost,
  getPosts,
  getPost,
  updatePostStatus,
  deletePost
} from '../controllers/posts.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.patch('/:id/status', updatePostStatus);
router.delete('/:id', deletePost);

export default router;