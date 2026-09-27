import { 
  TextToVideoProvider, 
  ImageToVideoProvider, 
  TextToSpeechProvider, 
  SpeechToTextProvider, 
  ImageGenerationProvider, 
  VideoEnhancementProvider 
} from './types.js';
import { LocalAIProvider } from './providers/LocalAIProvider.js';

class AIProviderManager {
  private localProvider: LocalAIProvider;
  private customApiKeys: Record<string, string> = {};

  constructor() {
    this.localProvider = new LocalAIProvider();
    if (process.env.OPENAI_API_KEY) {
      this.customApiKeys['openai'] = process.env.OPENAI_API_KEY;
    }
    if (process.env.ELEVENLABS_API_KEY) {
      this.customApiKeys['elevenlabs'] = process.env.ELEVENLABS_API_KEY;
    }
    if (process.env.REPLICATE_API_KEY) {
      this.customApiKeys['replicate'] = process.env.REPLICATE_API_KEY;
    }
  }

  getTextToVideoProvider(): TextToVideoProvider {
    return this.localProvider;
  }

  getImageToVideoProvider(): ImageToVideoProvider {
    return this.localProvider;
  }

  getTextToSpeechProvider(): TextToSpeechProvider {
    return this.localProvider;
  }

  getSpeechToTextProvider(): SpeechToTextProvider {
    return this.localProvider;
  }

  getImageGenerationProvider(): ImageGenerationProvider {
    return this.localProvider;
  }

  getVideoEnhancementProvider(): VideoEnhancementProvider {
    return this.localProvider;
  }

  setApiKey(provider: string, key: string) {
    this.customApiKeys[provider.toLowerCase()] = key;
  }

  getProviderStatus() {
    return {
      activeEngine: 'VidCraft Neural Studio Engine',
      modes: {
        textToVideo: { provider: 'LocalAIProvider', status: 'ready', description: 'Zero-cost cinematic storyboarding & scene generation' },
        imageToVideo: { provider: 'LocalAIProvider', status: 'ready', description: 'Dynamic Ken Burns & fluid 2.5D motion synthesis' },
        textToSpeech: { provider: 'LocalAIProvider + WebSpeech', status: 'ready', description: 'Multi-accent speech synthesis with synchronized subtitles' },
        speechToText: { provider: 'LocalAIProvider + Browser STT', status: 'ready', description: 'Automatic audio transcription & timed caption generator' },
        imageGen: { provider: 'Pollinations AI (Free)', status: 'ready', description: 'Ultra high-definition photorealistic generation without API key' },
        enhancement: { provider: 'VidCraft Cinema Matrix', status: 'ready', description: 'Real-time color grading, HDR tone mapping, and grain reduction' }
      },
      configuredExternalKeys: Object.keys(this.customApiKeys).filter(k => Boolean(this.customApiKeys[k]))
    };
  }
}

export const aiProviderManager = new AIProviderManager();
