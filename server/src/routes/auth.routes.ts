import { Router } from 'express';
import { signup, login, getMe, updateProfile, getUserProfile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.patch('/profile', authenticate, updateProfile);
router.get('/profile/:id', authenticate, getUserProfile);

export default router;