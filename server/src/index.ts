import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { prisma } from './config/database';
import { authenticate } from './middleware/auth.middleware';
import authRoutes from './routes/auth.routes';
import postsRoutes from './routes/posts.routes';
import communitiesRoutes from './routes/communities.routes';
import groupsRoutes from './routes/groups.routes';
import subgroupsRoutes from './routes/subgroups.routes';
import messagesRoutes from './routes/messages.routes';
import adminRoutes from './routes/admin.routes';
import friendshipsRoutes from './routes/friendships.routes';
import searchRoutes from './routes/search.routes';
import notificationsRoutes from './routes/notifications.routes';

import { setupSocketServer } from './socket/socketHandler';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 8000;

setupSocketServer(httpServer);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/api/health', (req, res) => {
  console.log('Health check hit');
  res.json({ message: 'Server is running!' });
});

// Test notification endpoint (remove in production)
app.post('/api/test-notification', authenticate, async (req, res) => {
  try {
    const userId = req.user!.id;
    
    console.log('🧪 [Test] Creating test notification for user:', userId);
    
    const notification = await prisma.notification.create({
      data: {
        userId,
        type: 'SYSTEM',
        title: 'Test Notification',
        message: 'This is a test notification. If you see this, notifications are working!',
        actionUrl: '/dashboard'
      }
    });
    
    console.log('✅ [Test] Notification created:', notification.id);
    
    res.json({ 
      success: true, 
      message: 'Test notification created!',
      notification 
    });
  } catch (error) {
    console.error('❌ [Test] Error creating notification:', error);
    res.status(500).json({ 
      error: 'Failed to create test notification',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/communities', communitiesRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/subgroups', subgroupsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/friendships', friendshipsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/notifications', notificationsRoutes);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('CORS enabled for http://localhost:3000');
  console.log('Socket.io enabled');
  console.log('📬 Notifications enabled');
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
