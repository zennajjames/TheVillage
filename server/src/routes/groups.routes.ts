import { Router } from 'express';
import {
  createGroup,
  getGroups,
  getGroup,
  joinGroup,
  leaveGroup,
  createGroupPost,
  deleteGroup
} from '../controllers/groups.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', createGroup);
router.get('/', getGroups);
router.get('/:id', getGroup);
router.post('/:id/join', joinGroup);
router.post('/:id/leave', leaveGroup);
router.post('/:id/posts', createGroupPost);
router.delete('/:id', deleteGroup);

export default router;