import { Router } from 'express';
import { searchLocalCommunities } from '../controllers/placesSearch.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/local-communities', searchLocalCommunities);

export default router;
