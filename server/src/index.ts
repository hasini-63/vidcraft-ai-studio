import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import authRouter, { getOrCreateDemoUser } from './routes/auth.js';
import projectsRouter from './routes/projects.js';
import mediaRouter from './routes/media.js';
import aiRouter from './routes/ai.js';
import renderRouter from './routes/render.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const uploadsDir = path.resolve(process.cwd(), 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/media', mediaRouter);
app.use('/api/ai', aiRouter);
app.use('/api/render', renderRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'VidCraft AI Studio Engine',
    timestamp: new Date().toISOString()
  });
});

// Initialize server and seed demo project
app.listen(PORT, async () => {
  console.log(`🚀 VidCraft AI Backend running at http://localhost:${PORT}`);
  try {
    await getOrCreateDemoUser();
    console.log('✅ Demo account and starter content initialized');
  } catch (err) {
    console.warn('⚠️ Demo user check warning:', err);
  }
});
