import { Router } from 'express';
import {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage
} from '../controllers/messages.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/conversations', getConversations);
router.get('/conversations/:otherUserId', getOrCreateConversation);
router.get('/conversations/:conversationId/messages', getMessages);
router.post('/conversations/:conversationId/messages', sendMessage);

router.get('/unread-count', authenticate, async (req, res) => {
  const userId = req.user!.id;
  
  const count = await prisma.message.count({
    where: {
      conversation: {
        participants: {
          some: { userId }
        }
      },
      senderId: { not: userId },
      read: false
    }
  });
  
  res.json({ count });
});

export default router;