import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'vidcraft-jwt-secret-key';

// Demo user seed helper
export async function getOrCreateDemoUser() {
  let demoUser = await prisma.user.findUnique({
    where: { email: 'creator@vidcraft.ai' }
  });

  if (!demoUser) {
    const passwordHash = await bcrypt.hash('vidcraft123', 10);
    demoUser = await prisma.user.create({
      data: {
        email: 'creator@vidcraft.ai',
        passwordHash,
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: 'Pro Creator'
      }
    });

    // Seed a sample project for the demo user
    const sampleProjectData = {
      tracks: [
        {
          id: 'track-video',
          name: 'Video & Overlays',
          type: 'video',
          clips: [
            {
              id: 'clip-1',
              title: 'Cyberpunk Metropolis',
              type: 'video',
              url: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-traffic-in-time-lapse-42095-large.mp4',
              startTime: 0,
              duration: 5,
              startOffset: 0,
              volume: 1,
              opacity: 1,
              speed: 1,
              filters: {
                brightness: 105,
                contrast: 115,
                saturation: 120,
                hueRotate: 0,
                preset: 'cinematic-teal-orange'
              }
            },
            {
              id: 'clip-2',
              title: 'Digital Data Streams',
              type: 'video',
              url: 'https://assets.mixkit.co/videos/preview/mixkit-laser-lights-projected-on-smoke-41712-large.mp4',
              startTime: 5,
              duration: 6,
              startOffset: 0,
              volume: 1,
              opacity: 1,
              speed: 1,
              filters: {
                brightness: 110,
                contrast: 120,
                saturation: 130,
                hueRotate: 15,
                preset: 'cyberpunk-neon'
              }
            }
          ]
        },
        {
          id: 'track-text',
          name: 'Captions & Titles',
          type: 'text',
          clips: [
            {
              id: 'text-1',
              title: 'FUTURE OF AI',
              type: 'text',
              text: 'FUTURE OF AI VIDEO',
              startTime: 0.5,
              duration: 4,
              fontSize: 44,
              fontColor: '#ffffff',
              fontFamily: 'Inter',
              fontWeight: 'bold',
              backgroundColor: 'rgba(0,0,0,0.6)',
              yPosition: 80, // % from top
              xPosition: 50, // % from left
              animation: 'fade'
            },
            {
              id: 'text-2',
              title: 'Create Without Limits',
              type: 'text',
              text: 'Create Without Limits',
              startTime: 5.5,
              duration: 5,
              fontSize: 40,
              fontColor: '#38bdf8',
              fontFamily: 'Inter',
              fontWeight: 'bold',
              backgroundColor: 'rgba(15,23,42,0.7)',
              yPosition: 80,
              xPosition: 50,
              animation: 'slide-up'
            }
          ]
        },
        {
          id: 'track-audio',
          name: 'Music & Voiceover',
          type: 'audio',
          clips: [
            {
              id: 'audio-1',
              title: 'Cyber Pulse Synthwave',
              type: 'audio',
              url: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
              startTime: 0,
              duration: 11,
              startOffset: 0,
              volume: 0.6
            }
          ]
        }
      ]
    };

    await prisma.project.create({
      data: {
        userId: demoUser.id,
        title: 'Cyberpunk Odyssey - Tech Teaser',
        description: 'High-energy futuristic promo edited with VidCraft AI',
        aspectRatio: '16:9',
        duration: 11.0,
        fps: 30,
        resolution: '1080p',
        thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80',
        data: JSON.stringify(sampleProjectData)
      }
    });
  }

  return demoUser;
}

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields (email, password, name) are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name)}`
      }
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar }
    });
  } catch (err: any) {
    console.error('Register error:', err);
    return res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      message: 'Logged in successfully',
      token,
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// Instant Demo Login (Zero barriers for testing)
router.post('/demo', async (_req: Request, res: Response) => {
  try {
    const demoUser = await getOrCreateDemoUser();
    const token = jwt.sign({ userId: demoUser.id, email: demoUser.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      message: 'Logged in as Demo Creator',
      token,
      user: { id: demoUser.id, email: demoUser.email, name: demoUser.name, avatar: demoUser.avatar }
    });
  } catch (err: any) {
    console.error('Demo login error:', err);
    return res.status(500).json({ error: 'Failed to initialize demo account' });
  }
});

// Current User Profile
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, avatar: true, role: true, createdAt: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

export default router;
