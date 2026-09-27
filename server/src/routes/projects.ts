import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'vidcraft-jwt-secret-key';

// Helper to extract userId or fallback to demo user
async function getUserIdFromReq(req: Request): Promise<string> {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return decoded.userId;
    } catch {
      // invalid token, fallback
    }
  }
  // Fallback to demo user if not logged in
  const demoUser = await prisma.user.findFirst({ where: { email: 'creator@vidcraft.ai' } });
  if (demoUser) return demoUser.id;
  // If demo user doesn't exist, create one
  const user = await prisma.user.create({
    data: {
      email: 'creator@vidcraft.ai',
      passwordHash: 'demohash',
      name: 'VidCraft Creator'
    }
  });
  return user.id;
}

// Starter Templates Definition
export const STARTER_TEMPLATES = [
  {
    id: 'template-tech-intro',
    title: 'Neon Cyberpunk YouTube Intro',
    description: 'High-octane intro for tech reviews, gaming, and code tutorials with glitch & neon titles.',
    aspectRatio: '16:9',
    duration: 10.0,
    category: 'YouTube',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    data: {
      tracks: [
        {
          id: 'track-v1',
          name: 'Video Track',
          type: 'video',
          clips: [
            {
              id: 'c1',
              title: 'Hologram Grid',
              type: 'video',
              url: 'https://assets.mixkit.co/videos/preview/mixkit-laser-lights-projected-on-smoke-41712-large.mp4',
              startTime: 0,
              duration: 5,
              startOffset: 0,
              volume: 1,
              opacity: 1,
              speed: 1,
              filters: { brightness: 110, contrast: 125, saturation: 140, hueRotate: 30, preset: 'cyberpunk-neon' }
            },
            {
              id: 'c2',
              title: 'Circuit Pulse',
              type: 'video',
              url: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-traffic-in-time-lapse-42095-large.mp4',
              startTime: 5,
              duration: 5,
              startOffset: 0,
              volume: 1,
              opacity: 1,
              speed: 1,
              filters: { brightness: 105, contrast: 120, saturation: 130, hueRotate: 0, preset: 'cinematic-teal-orange' }
            }
          ]
        },
        {
          id: 'track-t1',
          name: 'Motion Titles',
          type: 'text',
          clips: [
            {
              id: 't1',
              title: 'CYBER TECH',
              type: 'text',
              text: 'CYBER TECH LABS',
              startTime: 0.5,
              duration: 4.5,
              fontSize: 52,
              fontColor: '#38bdf8',
              fontFamily: 'Inter',
              fontWeight: '900',
              backgroundColor: 'rgba(15,23,42,0.8)',
              yPosition: 50,
              xPosition: 50,
              animation: 'zoom'
            },
            {
              id: 't2',
              title: 'EPISODE 42',
              type: 'text',
              text: 'EPISODE 42 • THE FUTURE IS HERE',
              startTime: 5.2,
              duration: 4.5,
              fontSize: 36,
              fontColor: '#f43f5e',
              fontFamily: 'Inter',
              fontWeight: 'bold',
              backgroundColor: 'rgba(0,0,0,0.7)',
              yPosition: 75,
              xPosition: 50,
              animation: 'fade'
            }
          ]
        },
        {
          id: 'track-a1',
          name: 'Soundtrack',
          type: 'audio',
          clips: [
            {
              id: 'a1',
              title: 'Synth Surge',
              type: 'audio',
              url: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
              startTime: 0,
              duration: 10,
              startOffset: 0,
              volume: 0.7
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-reels-hook',
    title: 'Viral TikTok / Reels Hook',
    description: 'Dynamic 9:16 vertical hook with punchy word-by-word highlighted captions & trending beat.',
    aspectRatio: '9:16',
    duration: 12.0,
    category: 'Shorts & Reels',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    data: {
      tracks: [
        {
          id: 'track-v1',
          name: 'Vertical Video',
          type: 'video',
          clips: [
            {
              id: 'c1',
              title: 'Surreal Colors',
              type: 'video',
              url: 'https://assets.mixkit.co/videos/preview/mixkit-curved-lines-of-light-flowing-in-darkness-41477-large.mp4',
              startTime: 0,
              duration: 6,
              startOffset: 0,
              volume: 1,
              opacity: 1,
              speed: 1,
              filters: { brightness: 105, contrast: 115, saturation: 130, hueRotate: -10, preset: 'cinematic-teal-orange' }
            },
            {
              id: 'c2',
              title: 'City Lights Motion',
              type: 'video',
              url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41584-large.mp4',
              startTime: 6,
              duration: 6,
              startOffset: 0,
              volume: 1,
              opacity: 1,
              speed: 1,
              filters: { brightness: 108, contrast: 120, saturation: 140, hueRotate: 20, preset: 'cyberpunk-neon' }
            }
          ]
        },
        {
          id: 'track-t1',
          name: 'Punchy Subtitles',
          type: 'text',
          clips: [
            {
              id: 't1',
              title: 'Hook Text',
              type: 'text',
              text: 'STOP SCROLLING! 🚨',
              startTime: 0.2,
              duration: 3.5,
              fontSize: 48,
              fontColor: '#facc15',
              fontFamily: 'Inter',
              fontWeight: '900',
              backgroundColor: 'rgba(0,0,0,0.85)',
              yPosition: 40,
              xPosition: 50,
              animation: 'bounce'
            },
            {
              id: 't2',
              title: 'Secret Hack',
              type: 'text',
              text: 'Here is the #1 AI Trick for 2026',
              startTime: 4.0,
              duration: 4.5,
              fontSize: 38,
              fontColor: '#ffffff',
              fontFamily: 'Inter',
              fontWeight: '800',
              backgroundColor: 'rgba(2,132,199,0.85)',
              yPosition: 55,
              xPosition: 50,
              animation: 'slide-up'
            },
            {
              id: 't3',
              title: 'Call To Action',
              type: 'text',
              text: 'Save This Video For Later 📌',
              startTime: 8.8,
              duration: 3.0,
              fontSize: 36,
              fontColor: '#4ade80',
              fontFamily: 'Inter',
              fontWeight: '800',
              backgroundColor: 'rgba(0,0,0,0.85)',
              yPosition: 70,
              xPosition: 50,
              animation: 'fade'
            }
          ]
        },
        {
          id: 'track-a1',
          name: 'Viral Background Sound',
          type: 'audio',
          clips: [
            {
              id: 'a1',
              title: 'Modern Lofi Beat',
              type: 'audio',
              url: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
              startTime: 0,
              duration: 12,
              startOffset: 0,
              volume: 0.8
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-product-promo',
    title: 'Minimalist Product Showcase',
    description: 'Clean, elegant 1:1 square video optimized for Instagram feeds and e-commerce ads.',
    aspectRatio: '1:1',
    duration: 10.0,
    category: 'Commercial',
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    data: {
      tracks: [
        {
          id: 'track-v1',
          name: 'Product Visuals',
          type: 'video',
          clips: [
            {
              id: 'c1',
              title: 'Studio Lighting',
              type: 'video',
              url: 'https://assets.mixkit.co/videos/preview/mixkit-flowing-layers-of-purple-and-blue-colors-41617-large.mp4',
              startTime: 0,
              duration: 10,
              startOffset: 0,
              volume: 1,
              opacity: 1,
              speed: 1,
              filters: { brightness: 102, contrast: 108, saturation: 110, hueRotate: 0, preset: 'clean-natural' }
            }
          ]
        },
        {
          id: 'track-t1',
          name: 'Features & Pricing',
          type: 'text',
          clips: [
            {
              id: 't1',
              title: 'Product Title',
              type: 'text',
              text: 'MEET NEXUS ONE',
              startTime: 0.5,
              duration: 4.5,
              fontSize: 42,
              fontColor: '#ffffff',
              fontFamily: 'Inter',
              fontWeight: '800',
              backgroundColor: 'rgba(0,0,0,0.6)',
              yPosition: 30,
              xPosition: 50,
              animation: 'fade'
            },
            {
              id: 't2',
              title: 'Tagline',
              type: 'text',
              text: 'Sound Reimagined. 40hr Battery.',
              startTime: 5.2,
              duration: 4.5,
              fontSize: 32,
              fontColor: '#a5f3fc',
              fontFamily: 'Inter',
              fontWeight: '600',
              backgroundColor: 'rgba(15,23,42,0.7)',
              yPosition: 75,
              xPosition: 50,
              animation: 'slide-up'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'template-quote-motivation',
    title: 'Cinematic Wisdom & Quotes',
    description: 'Breathtaking nature visuals with slow zoom and profound quotes for mindfulness channels.',
    aspectRatio: '16:9',
    duration: 12.0,
    category: 'Education & Mindset',
    thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
    data: {
      tracks: [
        {
          id: 'track-v1',
          name: 'Atmospheric Video',
          type: 'video',
          clips: [
            {
              id: 'c1',
              title: 'Mountain Drone',
              type: 'video',
              url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-foggy-forest-and-mountains-41582-large.mp4',
              startTime: 0,
              duration: 12,
              startOffset: 0,
              volume: 1,
              opacity: 1,
              speed: 1,
              filters: { brightness: 105, contrast: 110, saturation: 115, hueRotate: 0, preset: 'cinematic-teal-orange' }
            }
          ]
        },
        {
          id: 'track-t1',
          name: 'Quote Text',
          type: 'text',
          clips: [
            {
              id: 't1',
              title: 'Quote',
              type: 'text',
              text: '“The mind is everything. What you think you become.”',
              startTime: 1.0,
              duration: 10.0,
              fontSize: 38,
              fontColor: '#fef08a',
              fontFamily: 'Inter',
              fontWeight: '600',
              backgroundColor: 'rgba(0,0,0,0.65)',
              yPosition: 50,
              xPosition: 50,
              animation: 'fade'
            }
          ]
        }
      ]
    }
  }
];

// GET starter templates
router.get('/templates', (_req: Request, res: Response) => {
  return res.json({ templates: STARTER_TEMPLATES });
});

// GET all projects for current user
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = await getUserIdFromReq(req);
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });

    const parsed = projects.map(p => ({
      ...p,
      data: JSON.parse(p.data || '{"tracks":[]}')
    }));

    return res.json({ projects: parsed });
  } catch (err: any) {
    console.error('Fetch projects error:', err);
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET single project
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    // Check if it's one of the built-in starter templates
    const templateMatch = STARTER_TEMPLATES.find(t => t.id === id);
    if (templateMatch) {
      return res.json({
        project: {
          id: templateMatch.id,
          title: templateMatch.title,
          description: templateMatch.description,
          aspectRatio: templateMatch.aspectRatio,
          duration: templateMatch.duration,
          fps: 30,
          resolution: '1080p',
          thumbnail: templateMatch.thumbnail,
          data: templateMatch.data,
          isTemplate: true
        }
      });
    }

    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.json({
      project: {
        ...project,
        data: JSON.parse(project.data || '{"tracks":[]}')
      }
    });
  } catch (err: any) {
    console.error('Get project error:', err);
    return res.status(500).json({ error: 'Failed to retrieve project' });
  }
});

// POST create project
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = await getUserIdFromReq(req);
    const { 
      title = 'Untitled Video Project', 
      description = '', 
      aspectRatio = '16:9', 
      duration = 15.0, 
      templateId,
      initialData 
    } = req.body;

    let projectData = initialData;

    // If instantiated from a template
    if (templateId) {
      const template = STARTER_TEMPLATES.find(t => t.id === templateId);
      if (template) {
        projectData = template.data;
      }
    }

    if (!projectData) {
      projectData = {
        tracks: [
          {
            id: 'track-v1',
            name: 'Video Track 1',
            type: 'video',
            clips: []
          },
          {
            id: 'track-t1',
            name: 'Subtitles & Text',
            type: 'text',
            clips: []
          },
          {
            id: 'track-a1',
            name: 'Audio & Music',
            type: 'audio',
            clips: []
          }
        ]
      };
    }

    const defaultThumbnail = aspectRatio === '9:16'
      ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80';

    const project = await prisma.project.create({
      data: {
        userId,
        title,
        description,
        aspectRatio,
        duration: Number(duration) || 15.0,
        fps: 30,
        resolution: '1080p',
        thumbnail: req.body.thumbnail || defaultThumbnail,
        data: JSON.stringify(projectData)
      }
    });

    return res.status(201).json({
      project: {
        ...project,
        data: projectData
      }
    });
  } catch (err: any) {
    console.error('Create project error:', err);
    return res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT update project (Auto-save)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, description, aspectRatio, duration, fps, resolution, thumbnail, data } = req.body;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(aspectRatio !== undefined && { aspectRatio }),
        ...(duration !== undefined && { duration: Number(duration) }),
        ...(fps !== undefined && { fps: Number(fps) }),
        ...(resolution !== undefined && { resolution }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(data !== undefined && { data: typeof data === 'string' ? data : JSON.stringify(data) })
      }
    });

    return res.json({
      project: {
        ...updated,
        data: JSON.parse(updated.data || '{"tracks":[]}')
      }
    });
  } catch (err: any) {
    console.error('Update project error:', err);
    return res.status(500).json({ error: 'Failed to update project' });
  }
});

// POST duplicate project
router.post('/:id/duplicate', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = await getUserIdFromReq(req);

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const cloned = await prisma.project.create({
      data: {
        userId,
        title: `${project.title} (Copy)`,
        description: project.description,
        aspectRatio: project.aspectRatio,
        duration: project.duration,
        fps: project.fps,
        resolution: project.resolution,
        thumbnail: project.thumbnail,
        data: project.data
      }
    });

    return res.status(201).json({
      project: {
        ...cloned,
        data: JSON.parse(cloned.data)
      }
    });
  } catch (err: any) {
    console.error('Duplicate error:', err);
    return res.status(500).json({ error: 'Failed to duplicate project' });
  }
});

// DELETE project
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.project.delete({ where: { id } });
    return res.json({ message: 'Project deleted successfully' });
  } catch (err: any) {
    console.error('Delete project error:', err);
    return res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
