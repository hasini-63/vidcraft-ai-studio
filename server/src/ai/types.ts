export interface StoryboardScene {
  id: string;
  sceneNumber: number;
  duration: number; // in seconds
  visualPrompt: string;
  script: string; // voiceover text
  caption: string; // on-screen subtitle
  musicMood?: string;
  recommendedStockQuery?: string;
  generatedImageUrl?: string;
  transition?: 'fade' | 'zoom' | 'slide-left' | 'wipe' | 'none';
}

export interface StoryboardResult {
  title: string;
  overview: string;
  totalDuration: number;
  aspectRatio: string;
  style: string;
  scenes: StoryboardScene[];
}

export interface MotionSettings {
  motionType: 'ken-burns-in' | 'ken-burns-out' | 'pan-left' | 'pan-right' | 'pulse' | 'orbit';
  intensity: number; // 0.1 to 1.0
  duration: number; // in seconds
  aspectRatio: string;
}

export interface SpeechSynthesisResult {
  audioUrl?: string;
  audioBase64?: string;
  duration: number;
  format: 'mp3' | 'wav';
  phonemesOrTimings?: Array<{ word: string; start: number; end: number }>;
}

export interface TranscriptionSegment {
  id: string;
  start: number; // in seconds
  end: number;
  text: string;
  confidence: number;
}

export interface EnhancementProfile {
  id: string;
  name: string;
  description: string;
  filters: {
    brightness: number; // 0 to 200, 100 default
    contrast: number; // 0 to 200, 100 default
    saturation: number; // 0 to 200, 100 default
    hueRotate: number; // degrees -180 to 180
    sharpness: number; // 0 to 10
    vignette: number; // 0 to 1
    sepia: number; // 0 to 1
    colorTemperature: number; // -100 (cool) to +100 (warm)
    grain: number; // 0 to 1
  };
}

export interface TextToVideoProvider {
  name: string;
  generateStoryboard(prompt: string, options?: { duration?: number; style?: string; aspectRatio?: string }): Promise<StoryboardResult>;
}

export interface ImageToVideoProvider {
  name: string;
  animateImage(imageUrl: string, settings: MotionSettings): Promise<{ videoUrl: string; duration: number }>;
}

export interface TextToSpeechProvider {
  name: string;
  synthesizeSpeech(text: string, options?: { voice?: string; pitch?: number; rate?: number }): Promise<SpeechSynthesisResult>;
}

export interface SpeechToTextProvider {
  name: string;
  transcribeAudio(audioData: Buffer | string): Promise<{ text: string; segments: TranscriptionSegment[] }>;
}

export interface ImageGenerationProvider {
  name: string;
  generateImage(prompt: string, options?: { aspectRatio?: string; style?: string }): Promise<string>;
}

export interface VideoEnhancementProvider {
  name: string;
  getPresets(): EnhancementProfile[];
  applyEnhancement(presetId: string, customAdjustments?: Partial<EnhancementProfile['filters']>): EnhancementProfile['filters'];
}
