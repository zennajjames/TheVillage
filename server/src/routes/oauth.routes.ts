import { Router } from 'express';
import {
  googleAuth,
  googleCallback,
  facebookAuth,
  facebookCallback,
  completeOnboarding
} from '../controllers/oauth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// Facebook OAuth routes
router.get('/facebook', facebookAuth);
router.get('/facebook/callback', facebookCallback);

// Complete onboarding after OAuth
router.post('/complete-onboarding', authenticate, completeOnboarding);

export default router;
