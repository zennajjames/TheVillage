import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  createSubGroup,
  getSubGroups,
  getSubGroup,
  joinSubGroup,
  leaveSubGroup,
  deleteSubGroup
} from '../controllers/subgroups.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create a new subgroup
router.post('/', createSubGroup);

// Get all subgroups for a parent community
router.get('/community/:parentCommunityId', getSubGroups);

// Get a specific subgroup
router.get('/:id', getSubGroup);

// Join a subgroup
router.post('/:id/join', joinSubGroup);

// Leave a subgroup
router.post('/:id/leave', leaveSubGroup);

// Delete a subgroup
router.delete('/:id', deleteSubGroup);

export default router;
