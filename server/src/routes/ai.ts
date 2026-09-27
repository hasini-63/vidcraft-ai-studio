import { Router, Request, Response } from 'express';
import { aiProviderManager } from '../ai/AIProviderManager.js';

const router = Router();

// Generate Storyboard / Script to Video
router.post('/storyboard', async (req: Request, res: Response) => {
  try {
    const { prompt, duration = 15, style = 'cinematic', aspectRatio = '16:9' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'A prompt or topic is required to generate a video storyboard' });
    }

    const provider = aiProviderManager.getTextToVideoProvider();
    const result = await provider.generateStoryboard(prompt, { duration, style, aspectRatio });
    return res.json({ result });
  } catch (err: any) {
    console.error('Storyboard generation error:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate storyboard' });
  }
});

// Generate Image from Prompt
router.post('/image-gen', async (req: Request, res: Response) => {
  try {
    const { prompt, aspectRatio = '16:9', style = 'photorealistic' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const provider = aiProviderManager.getImageGenerationProvider();
    const imageUrl = await provider.generateImage(prompt, { aspectRatio, style });
    return res.json({ imageUrl, prompt });
  } catch (err: any) {
    console.error('Image gen error:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate image' });
  }
});

// Image to Video Motion Path
router.post('/motion', async (req: Request, res: Response) => {
  try {
    const { imageUrl, motionType = 'ken-burns-in', intensity = 0.5, duration = 5, aspectRatio = '16:9' } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const provider = aiProviderManager.getImageToVideoProvider();
    const result = await provider.animateImage(imageUrl, {
      motionType,
      intensity,
      duration,
      aspectRatio
    });

    return res.json({ result });
  } catch (err: any) {
    console.error('Motion generation error:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate motion' });
  }
});

// AI Voiceover / Text to Speech
router.post('/tts', async (req: Request, res: Response) => {
  try {
    const { text, voice = 'Alex', pitch = 1.0, rate = 1.0 } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for voiceover generation' });
    }

    const provider = aiProviderManager.getTextToSpeechProvider();
    const result = await provider.synthesizeSpeech(text, { voice, pitch, rate });
    return res.json({ result });
  } catch (err: any) {
    console.error('TTS error:', err);
    return res.status(500).json({ error: err.message || 'Failed to synthesize voiceover' });
  }
});

// Speech to Text / Auto Subtitles
router.post('/stt', async (req: Request, res: Response) => {
  try {
    const { audioUrl } = req.body;
    const provider = aiProviderManager.getSpeechToTextProvider();
    const result = await provider.transcribeAudio(audioUrl || '');
    return res.json({ result });
  } catch (err: any) {
    console.error('STT error:', err);
    return res.status(500).json({ error: err.message || 'Failed to transcribe audio' });
  }
});

// Enhancement presets
router.get('/presets', (_req: Request, res: Response) => {
  const provider = aiProviderManager.getVideoEnhancementProvider();
  return res.json({ presets: provider.getPresets() });
});

// Provider status & configuration
router.get('/providers', (_req: Request, res: Response) => {
  return res.json(aiProviderManager.getProviderStatus());
});

router.post('/providers/key', (req: Request, res: Response) => {
  const { provider, apiKey } = req.body;
  if (!provider || !apiKey) {
    return res.status(400).json({ error: 'Provider name and apiKey are required' });
  }

  aiProviderManager.setApiKey(provider, apiKey);
  return res.json({ message: `API Key for ${provider} updated successfully` });
});

export default router;
