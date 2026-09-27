# VidCraft AI — All-in-One AI Video Creation, Editing & Media Studio

> **Tagline:** Create. Edit. Enhance. Share.  
> **Brand:** VidCraft AI

**VidCraft AI** is a complete, production-style, web-based AI video creation, editing, and media studio. Designed for creators of all experience levels, it enables users to generate, edit, enhance, subtitle, voice-over, and export high-impact videos all in one unified application.

---

## 🌟 Key Highlights & Capabilities

* **AI Video Generator (Prompt-to-Video)**: Convert topics or scripts into multi-scene video storyboards complete with scenes, visual prompts, background visuals, narration scripts, and synced captions in seconds.
* **Professional Multi-Track Video Editor**: Multi-track timeline (Video, Text/Subtitle, Audio) with frame-accurate scrubbing, clip splitting (`S`), trimming in/out, duplicating (`Ctrl+D`), deleting, speed ramping (0.25x - 4x), opacity, and volume controls.
* **AI Voice-Over (TTS)**: Built-in natural neural speech synthesis with multiple character voices (Alex, Sarah, Marcus, Elena), customizable pitch and playback speed, live voice preview, and instant placement onto the audio track.
* **Live Microphone Voiceover**: Record microphone voiceover directly into the timeline with countdown and live timer visualizer.
* **Automatic Subtitles & STT**: One-click audio-to-timed-subtitle transcription with TikTok, Netflix, and Cyberpunk styling presets (font size, color, background pills, and animations).
* **Image-to-Video Motion**: Transform still photographs into animated video clips using dynamic Ken Burns motion paths (Zoom In, Zoom Out, Pan Left, Pan Right, Depth Pulse).
* **AI Video Enhancement & Color Grading**: 7 Hollywood-grade presets (Cinematic Teal & Orange, Cyberpunk Neon, Crisp Ultra HDR, Vintage 90s Film, Noir Monochrome, Golden Sunset Glow, Clean Studio Pro) with real-time brightness, contrast, saturation, and hue adjustments.
* **Aspect Ratio Switcher**: Instant switching between `16:9` (YouTube/Web), `9:16` (TikTok/Reels/Shorts), `1:1` (Instagram Feed), `4:5` (Social Ads), and `21:9` (Cinematic Ultrawide).
* **Stock Media & SFX Library**: Curated royalty-free videos, background music tracks, and sound effects with built-in audio player and 1-click timeline insertion.
* **Zero-Cost Free AI Engine**: Every single feature runs 100% free out of the box using built-in open-source and browser-native engines without requiring any paid API keys.
* **4K Ultra-HD Export**: Real-time rendering into MP4 and WebM with custom frame rates (24, 30, 60 FPS) and instant browser download.

---

## 🛠️ Technology Stack

### Frontend (`/client`)
* **Framework**: React 19 + TypeScript + Vite
* **Styling**: Tailwind CSS + Custom Studio Dark Theme tokens
* **Icons**: Lucide React
* **Video Engine**: HTML5 Canvas composite multi-layer rendering pipeline + Web Audio API
* **Export**: MediaRecorder / WebCodecs browser rendering engine + instant file download
* **Visual Polish**: Canvas Confetti, glassmorphism, responsive controls

### Backend (`/server`)
* **Runtime**: Node.js + Express + TypeScript
* **Database**: Prisma ORM with SQLite (zero-config, self-contained `dev.db`)
* **Authentication**: JWT token authentication with bcrypt password hashing + 1-Click Instant Demo Login
* **File Uploads**: Multer disk storage (up to 500MB video/audio/image uploads)
* **AI Provider Abstraction Layer**:
  * `TextToVideoProvider`
  * `ImageToVideoProvider`
  * `TextToSpeechProvider`
  * `SpeechToTextProvider`
  * `ImageGenerationProvider`
  * `VideoEnhancementProvider`

---

## 🚀 Quick Start Guide

### 1. Start Both Backend & Frontend Concurrently

From the root project folder:
```bash
npm run dev
```

* **Frontend**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5000](http://localhost:5000)

### 2. Or Run Separately

**Backend Server:**
```bash
cd server
npm run dev
```

**Frontend Client:**
```bash
cd client
npm run dev
```

---

## ⌨️ Studio Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Space` | Play / Pause video playback |
| `S` | Split selected clip at playhead |
| `Delete` / `Backspace` | Delete selected clip |
| `Ctrl + Z` / `Cmd + Z` | Undo |
| `Ctrl + Y` / `Cmd + Y` | Redo |
| `Escape` | Deselect current clip |

---

## 📁 Project Architecture

```
editing-website/
├── package.json               # Root scripts (concurrently dev & build)
├── README.md                  # Documentation & user guide
├── server/                    # Express backend
│   ├── prisma/
│   │   ├── schema.prisma      # User, Project, Asset, and AIJob models
│   │   └── dev.db             # Local SQLite database
│   ├── src/
│   │   ├── ai/
│   │   │   ├── AIProviderManager.ts   # Central AI provider registry
│   │   │   ├── types.ts               # Provider interfaces
│   │   │   └── providers/
│   │   │       └── LocalAIProvider.ts # Built-in zero-cost AI provider
│   │   ├── routes/
│   │   │   ├── auth.ts        # Register, login, demo, me
│   │   │   ├── projects.ts    # CRUD, duplicate, templates
│   │   │   ├── media.ts       # Uploads & stock library
│   │   │   ├── ai.ts          # Storyboards, TTS, STT, presets
│   │   │   └── render.ts      # Video rendering endpoint
│   │   └── index.ts           # Server entry point
│   ├── uploads/               # Local media asset storage
│   └── package.json
└── client/                    # React Vite frontend
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.tsx     # Header bar with aspect switcher & export
    │   │   ├── AuthModal.tsx  # Sign In / Demo account modal
    │   │   ├── Studio/
    │   │   │   ├── VideoCanvas.tsx       # Real-time multi-track canvas player
    │   │   │   ├── Timeline.tsx          # Multi-track timeline editor
    │   │   │   ├── LeftSidebar.tsx       # Media, AI Tools, Subtitles, Stock
    │   │   │   ├── RightInspector.tsx    # Clip properties & filters
    │   │   │   ├── ExportModal.tsx       # 720p/1080p/4K MP4/WebM export
    │   │   │   └── AIProviderModal.tsx   # Provider status & API keys
    │   │   └── LandingPage/
    │   │       ├── Hero.tsx              # Hero with interactive studio preview
    │   │       ├── FeaturesSection.tsx   # 9 studio feature showcases
    │   │       ├── HowItWorks.tsx        # 4-step workflow
    │   │       ├── SupportedContent.tsx  # YouTube, TikTok, Reels, etc.
    │   │       ├── TemplatesShowcase.tsx # Starter template loader
    │   │       └── Footer.tsx            # Branding & tech stack
    │   ├── services/
    │   │   └── api.ts         # REST API client with local fallbacks
    │   ├── types/
    │   │   └── index.ts       # TypeScript models
    │   └── App.tsx            # Studio & Landing coordinator
    ├── tailwind.config.js     # Studio color palette
    └── vite.config.ts         # Proxy config for port 5000
```

---

## 🎨 Branding & License

* **Brand Name**: VidCraft AI
* **Tagline**: Create. Edit. Enhance. Share.
* **License**: ISC
