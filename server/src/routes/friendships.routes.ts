import { Router } from 'express';
import {
  sendFriendRequest,
  respondToFriendRequest,
  getFriends,
  getPendingRequests,
  removeFriend,
  getFriendshipStatus
} from '../controllers/friendships.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/request', sendFriendRequest);
router.patch('/:friendshipId/respond', respondToFriendRequest);
router.get('/friends', getFriends);
router.get('/pending', getPendingRequests);
router.delete('/:friendshipId', removeFriend);
router.get('/status/:otherUserId', getFriendshipStatus);

export default router;