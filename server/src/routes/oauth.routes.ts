import { Router } from 'express';
import {
  googleAuth,
  googleCallback,
  completeOnboarding
} from '../controllers/oauth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// Complete onboarding after OAuth
router.post('/complete-onboarding', authenticate, completeOnboarding);

export default router;
