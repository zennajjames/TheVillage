import { Router } from 'express';
import {
  createHelpRequest,
  getCommunityHelpRequests,
  getAdminInbox,
  getHelpRequest,
  updateHelpRequestStatus,
  createProxyPost,
  deleteHelpRequest,
} from '../controllers/helpRequests.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', createHelpRequest);
router.get('/community/:communityId', getCommunityHelpRequests);
router.get('/admin/:communityId', getAdminInbox);
router.get('/:id', getHelpRequest);
router.patch('/:id/status', updateHelpRequestStatus);
router.post('/:id/proxy', createProxyPost);
router.delete('/:id', deleteHelpRequest);

export default router;
