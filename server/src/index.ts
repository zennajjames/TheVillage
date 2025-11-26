import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { prisma } from './config/database';
import authRoutes from './routes/auth.routes';
import postsRoutes from './routes/posts.routes';
import groupsRoutes from './routes/groups.routes';
import messagesRoutes from './routes/messages.routes';
import { setupSocketServer } from './socket/socketHandler';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 8000;

// Setup Socket.io
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

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/messages', messagesRoutes);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('CORS enabled for http://localhost:3000');
  console.log('Socket.io enabled');
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});