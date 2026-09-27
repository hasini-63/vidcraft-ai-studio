export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5' | '21:9';

export type ClipType = 'video' | 'audio' | 'text' | 'image';

export interface FilterSettings {
  brightness: number; // 0-200, 100 default
  contrast: number; // 0-200, 100 default
  saturation: number; // 0-200, 100 default
  hueRotate: number; // -180 to 180
  sharpness?: number;
  vignette?: number;
  sepia?: number;
  colorTemperature?: number;
  preset?: string;
}

export interface MotionSettings {
  type: 'ken-burns-in' | 'ken-burns-out' | 'pan-left' | 'pan-right' | 'pulse' | 'none';
  intensity: number;
}

export interface Clip {
  id: string;
  title: string;
  type: ClipType;
  url?: string;
  startTime: number; // Seconds on timeline
  duration: number; // Seconds
  startOffset?: number; // In-point offset into source media
  volume?: number; // 0 to 1
  opacity?: number; // 0 to 1
  speed?: number; // 0.25 to 4.0
  filters?: FilterSettings;
  motion?: MotionSettings;

  // Text / Subtitle attributes
  text?: string;
  fontSize?: number;
  fontColor?: string;
  fontFamily?: string;
  fontWeight?: string;
  backgroundColor?: string;
  xPosition?: number; // percentage 0 to 100
  yPosition?: number; // percentage 0 to 100
  animation?: 'none' | 'fade' | 'slide-up' | 'zoom' | 'bounce' | 'karaoke';
  highlightColor?: string;
}

export interface Track {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'text';
  clips: Clip[];
  muted?: boolean;
  hidden?: boolean;
  locked?: boolean;
}

export interface ProjectData {
  tracks: Track[];
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  aspectRatio: AspectRatio;
  duration: number;
  fps: number;
  resolution: string;
  thumbnail?: string;
  data: ProjectData;
  isTemplate?: boolean;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface StoryboardScene {
  id: string;
  sceneNumber: number;
  duration: number;
  visualPrompt: string;
  script: string;
  caption: string;
  musicMood?: string;
  recommendedStockQuery?: string;
  generatedImageUrl?: string;
  transition?: string;
}

export interface StoryboardResult {
  title: string;
  overview: string;
  totalDuration: number;
  aspectRatio: AspectRatio;
  style: string;
  scenes: StoryboardScene[];
}

export interface EnhancementProfile {
  id: string;
  name: string;
  description: string;
  filters: FilterSettings;
}

export interface StockMediaItem {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  category?: string;
  duration?: number;
  aspectRatio?: string;
  artist?: string;
  genre?: string;
}
