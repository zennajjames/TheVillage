import { Router } from 'express';
import { 
  signup, 
  login, 
  getMe, 
  updateProfile, 
  getUserProfile,
  forgotPassword,
  resetPassword,
  updateNotificationPreferences
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/me', authenticate, getMe);
router.patch('/profile', authenticate, updateProfile);
router.get('/profile/:id', authenticate, getUserProfile);
router.patch('/notifications', authenticate, updateNotificationPreferences);

export default router;