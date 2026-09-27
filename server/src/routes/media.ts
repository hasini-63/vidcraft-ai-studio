import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import prisma from '../prisma.js';

const router = Router();
const uploadsDir = path.resolve(process.cwd(), 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer disk storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500 MB limit
});

// Curated Royalty-Free Media Library (Stock Videos, Music, SFX, Images)
const STOCK_LIBRARY = {
  videos: [
    {
      id: 'stock-v-cyber-city',
      title: 'Cyberpunk Skyline & Traffic',
      category: 'Cyber & Future',
      duration: 14.0,
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-traffic-in-time-lapse-42095-large.mp4',
      aspectRatio: '16:9'
    },
    {
      id: 'stock-v-laser-lights',
      title: 'Neon Laser Beams & Smoke',
      category: 'Cyber & Future',
      duration: 8.5,
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-laser-lights-projected-on-smoke-41712-large.mp4',
      aspectRatio: '16:9'
    },
    {
      id: 'stock-v-misty-mountains',
      title: 'Majestic Mountain Fog & Sunrise',
      category: 'Nature & Landscape',
      duration: 15.0,
      thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-foggy-forest-and-mountains-41582-large.mp4',
      aspectRatio: '16:9'
    },
    {
      id: 'stock-v-curved-light',
      title: 'Curved Neon Lines Flowing',
      category: 'Abstract',
      duration: 10.0,
      thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-curved-lines-of-light-flowing-in-darkness-41477-large.mp4',
      aspectRatio: '9:16'
    },
    {
      id: 'stock-v-city-night-traffic',
      title: 'Golden Highway Night Aerial',
      category: 'Urban',
      duration: 12.0,
      thumbnail: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=400&q=80',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41584-large.mp4',
      aspectRatio: '16:9'
    },
    {
      id: 'stock-v-liquid-purple',
      title: 'Fluid Violet & Sapphire Waves',
      category: 'Abstract',
      duration: 9.0,
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-flowing-layers-of-purple-and-blue-colors-41617-large.mp4',
      aspectRatio: '16:9'
    },
    {
      id: 'stock-v-waves-beach',
      title: 'Tropical Azure Ocean Waves',
      category: 'Nature & Landscape',
      duration: 11.0,
      thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
      aspectRatio: '16:9'
    }
  ],
  music: [
    {
      id: 'stock-m-synthwave',
      title: 'Cyber Pulse Dream',
      artist: 'VidCraft Sound Lab',
      genre: 'Synthwave / Electronic',
      duration: 65.0,
      bpm: 120,
      url: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3'
    },
    {
      id: 'stock-m-lofi',
      title: 'Midnight Coffee Lofi',
      artist: 'Chillout Studios',
      genre: 'Lofi Hip Hop',
      duration: 48.0,
      bpm: 85,
      url: 'https://cdn.freesound.org/previews/563/563174_11861866-lq.mp3'
    },
    {
      id: 'stock-m-cinematic-epic',
      title: 'Beyond the Horizon',
      artist: 'Apex Orchestral',
      genre: 'Cinematic Ambient',
      duration: 72.0,
      bpm: 90,
      url: 'https://cdn.freesound.org/previews/538/538908_1156514-lq.mp3'
    },
    {
      id: 'stock-m-corporate-upbeat',
      title: 'Inspiration & Progress',
      artist: 'Modern Groove',
      genre: 'Upbeat Corporate',
      duration: 55.0,
      bpm: 115,
      url: 'https://cdn.freesound.org/previews/608/608645_11861866-lq.mp3'
    }
  ],
  sfx: [
    {
      id: 'sfx-whoosh-fast',
      title: 'Cinematic Fast Whoosh',
      category: 'Transitions',
      duration: 0.8,
      url: 'https://cdn.freesound.org/previews/608/608645_11861866-lq.mp3'
    },
    {
      id: 'sfx-camera-shutter',
      title: 'Camera Shutter Click',
      category: 'UI & Action',
      duration: 0.5,
      url: 'https://cdn.freesound.org/previews/387/387531_7255533-lq.mp3'
    },
    {
      id: 'sfx-pop-bubble',
      title: 'Modern Soft Pop',
      category: 'UI & Action',
      duration: 0.3,
      url: 'https://cdn.freesound.org/previews/566/566736_11861866-lq.mp3'
    },
    {
      id: 'sfx-impact-deep',
      title: 'Subtle Bass Impact',
      category: 'Cinematic',
      duration: 1.5,
      url: 'https://cdn.freesound.org/previews/456/456565_97763-lq.mp3'
    }
  ],
  images: [
    {
      id: 'stock-img-1',
      title: 'Neon Cyberpunk Street',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      category: 'Tech'
    },
    {
      id: 'stock-img-2',
      title: 'Alps Mountain Lake',
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      category: 'Nature'
    },
    {
      id: 'stock-img-3',
      title: 'Minimalist Workspace Setup',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      category: 'Business'
    },
    {
      id: 'stock-img-4',
      title: 'Prismatic Fluid Waves',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      category: 'Abstract'
    }
  ]
};

// GET Stock Media
router.get('/stock', (req: Request, res: Response) => {
  const { type = 'all', query = '', category = '' } = req.query;

  let results: any = { ...STOCK_LIBRARY };

  if (type === 'video') results = { videos: STOCK_LIBRARY.videos };
  else if (type === 'audio' || type === 'music') results = { music: STOCK_LIBRARY.music, sfx: STOCK_LIBRARY.sfx };
  else if (type === 'sfx') results = { sfx: STOCK_LIBRARY.sfx };
  else if (type === 'image') results = { images: STOCK_LIBRARY.images };

  // Filter by search query if supplied
  if (query && typeof query === 'string') {
    const q = query.toLowerCase();
    if (results.videos) results.videos = results.videos.filter((v: any) => v.title.toLowerCase().includes(q) || v.category.toLowerCase().includes(q));
    if (results.music) results.music = results.music.filter((m: any) => m.title.toLowerCase().includes(q) || m.genre.toLowerCase().includes(q));
    if (results.sfx) results.sfx = results.sfx.filter((s: any) => s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    if (results.images) results.images = results.images.filter((img: any) => img.title.toLowerCase().includes(q) || img.category.toLowerCase().includes(q));
  }

  // Filter by category
  if (category && typeof category === 'string') {
    const cat = category.toLowerCase();
    if (results.videos) results.videos = results.videos.filter((v: any) => v.category.toLowerCase() === cat);
    if (results.images) results.images = results.images.filter((img: any) => img.category.toLowerCase() === cat);
  }

  return res.json(results);
});

// POST Upload Single or Multiple Files
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { projectId } = req.body;
    const mime = file.mimetype;
    let type = 'video';
    if (mime.startsWith('audio/')) type = 'audio';
    else if (mime.startsWith('image/')) type = 'image';

    const fileUrl = `/uploads/${file.filename}`;

    // Optionally link to demo user or req user
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { email: 'creator@vidcraft.ai', passwordHash: 'hash', name: 'Creator' }
      });
    }

    const asset = await prisma.asset.create({
      data: {
        userId: user.id,
        projectId: projectId || null,
        name: file.originalname,
        type,
        url: fileUrl,
        size: file.size,
        mimeType: mime
      }
    });

    return res.status(201).json({
      asset: {
        ...asset,
        filename: file.filename,
        originalName: file.originalname
      }
    });
  } catch (err: any) {
    console.error('File upload error:', err);
    return res.status(500).json({ error: err.message || 'File upload failed' });
  }
});

export default router;
