import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getAllCommunities,
  getUserCommunities,
  getCommunityById,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity,
  updateMemberRole,
  removeMember,
  createCommunityPost,
} from '../controllers/communities.controller';

const router = express.Router();

// Public routes (with optional auth)
router.get('/', authenticate, getAllCommunities);

// Protected routes
router.get('/my-communities', authenticate, getUserCommunities);
router.get('/:id', authenticate, getCommunityById);
router.post('/', authenticate, createCommunity);
router.put('/:id', authenticate, updateCommunity);
router.delete('/:id', authenticate, deleteCommunity);
router.post('/:id/join', authenticate, joinCommunity);
router.post('/:id/leave', authenticate, leaveCommunity);
router.put('/:id/members/:memberId/role', authenticate, updateMemberRole);
router.delete('/:id/members/:memberId', authenticate, removeMember);
router.post('/:id/posts', authenticate, createCommunityPost);

export default router;
