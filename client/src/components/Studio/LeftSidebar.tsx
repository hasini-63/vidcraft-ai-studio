import React, { useState, useEffect, useRef } from 'react';
import { 
  FolderOpen, 
  Wand2, 
  Type, 
  Mic, 
  Volume2, 
  Image as ImageIcon, 
  Sparkles, 
  Music, 
  LayoutTemplate, 
  Upload, 
  Play, 
  Pause, 
  Plus, 
  Search, 
  Layers,
  Check,
  Radio,
  Sliders,
  Flame,
  ArrowRight
} from 'lucide-react';
import { Project, Track, Clip, StockMediaItem, EnhancementProfile } from '../../types';
import { api } from '../../services/api';

interface LeftSidebarProps {
  project: Project;
  onUpdateTracks: (tracks: Track[]) => void;
  onUpdateProjectDuration: (duration: number) => void;
  currentTime: number;
}

type TabType = 'media' | 'ai-video' | 'voiceover' | 'recorder' | 'subtitles' | 'image-to-video' | 'enhance' | 'stock' | 'templates';

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  project,
  onUpdateTracks,
  onUpdateProjectDuration,
  currentTime
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('ai-video');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- TAB 1: MEDIA UPLOAD STATE ---
  const [uploadedAssets, setUploadedAssets] = useState<Array<{ name: string; url: string; type: string }>>([
    {
      name: 'Cyberpunk Skyline',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-traffic-in-time-lapse-42095-large.mp4',
      type: 'video'
    },
    {
      name: 'Laser Lights',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-laser-lights-projected-on-smoke-41712-large.mp4',
      type: 'video'
    },
    {
      name: 'Neon Grid Texture',
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
      type: 'image'
    }
  ]);
  const [isUploading, setIsUploading] = useState(false);

  // --- TAB 2: AI SCRIPT-TO-VIDEO STATE ---
  const [aiPrompt, setAiPrompt] = useState('5 Mind-Blowing AI Breakthroughs Transforming the World in 2026');
  const [aiDuration, setAiDuration] = useState<number>(15);
  const [aiStyle, setAiStyle] = useState('modern-cinematic');
  const [isGeneratingAiVideo, setIsGeneratingAiVideo] = useState(false);
  const [aiGenStatus, setAiGenStatus] = useState<string>('');

  // --- TAB 3: AI VOICE OVER (TTS) STATE ---
  const [ttsText, setTtsText] = useState('Welcome to VidCraft AI. The ultimate studio for high impact videos.');
  const [ttsVoice, setTtsVoice] = useState('Alex');
  const [ttsPitch, setTtsPitch] = useState(1.0);
  const [ttsSpeed, setTtsSpeed] = useState(1.0);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // --- TAB 4: NORMAL VOICE RECORDER (MIC) STATE ---
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // --- TAB 5: SUBTITLES STATE ---
  const [isGeneratingSubtitles, setIsGeneratingSubtitles] = useState(false);
  const [manualSubtitleText, setManualSubtitleText] = useState('Captivating Key Message Here');
  const [subtitleStyle, setSubtitleStyle] = useState<'tiktok' | 'netflix' | 'cyber' | 'karaoke'>('tiktok');

  // --- TAB 6: IMAGE TO VIDEO MOTION STATE ---
  const [motionImage, setMotionImage] = useState<string>('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80');
  const [motionType, setMotionType] = useState<'ken-burns-in' | 'ken-burns-out' | 'pan-left' | 'pan-right' | 'pulse'>('ken-burns-in');
  const [motionDuration, setMotionDuration] = useState<number>(5);

  // --- TAB 7: AI ENHANCE STATE ---
  const [presets, setPresets] = useState<EnhancementProfile[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('cinematic-teal-orange');

  // --- TAB 8: STOCK MEDIA STATE ---
  const [stockType, setStockType] = useState<'video' | 'music' | 'sfx' | 'image'>('video');
  const [stockSearch, setStockSearch] = useState('');
  const [stockVideos, setStockVideos] = useState<StockMediaItem[]>([]);
  const [stockMusic, setStockMusic] = useState<StockMediaItem[]>([]);
  const [stockSfx, setStockSfx] = useState<StockMediaItem[]>([]);
  const [stockImages, setStockImages] = useState<StockMediaItem[]>([]);
  const [previewingAudio, setPreviewingAudio] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Load presets & stock media on mount
  useEffect(() => {
    api.getEnhancementPresets().then(res => setPresets(res));
    loadStockMedia();
  }, []);

  const loadStockMedia = async () => {
    const data = await api.getStockMedia();
    if (data.videos) setStockVideos(data.videos);
    if (data.music) setStockMusic(data.music);
    if (data.sfx) setStockSfx(data.sfx);
    if (data.images) setStockImages(data.images);
  };

  // Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const asset = await api.uploadFile(file);
      setUploadedAssets(prev => [asset, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  // Helper to add a clip to corresponding track
  const addClipToTrack = (clip: Partial<Clip>, trackType: 'video' | 'audio' | 'text') => {
    let targetTrack = project.data.tracks.find(t => t.type === trackType);
    let tracks = [...project.data.tracks];

    if (!targetTrack) {
      targetTrack = {
        id: `track-${trackType}-${Date.now().toString(36)}`,
        name: `${trackType.toUpperCase()} Track`,
        type: trackType,
        clips: []
      };
      tracks.push(targetTrack);
    }

    const duration = clip.duration || 5;
    const startTime = currentTime;

    const newClip: Clip = {
      id: `clip-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`,
      title: clip.title || 'Untitled Clip',
      type: clip.type || (trackType === 'video' ? 'video' : trackType === 'audio' ? 'audio' : 'text'),
      url: clip.url,
      startTime: Number(startTime.toFixed(2)),
      duration: Number(duration.toFixed(2)),
      startOffset: clip.startOffset || 0,
      volume: clip.volume ?? 1,
      opacity: clip.opacity ?? 1,
      speed: clip.speed ?? 1,
      filters: clip.filters,
      motion: clip.motion,
      text: clip.text,
      fontSize: clip.fontSize,
      fontColor: clip.fontColor,
      backgroundColor: clip.backgroundColor,
      animation: clip.animation,
      xPosition: clip.xPosition ?? 50,
      yPosition: clip.yPosition ?? (trackType === 'text' ? 80 : 50)
    };

    const updatedTracks = tracks.map(t => {
      if (t.id === targetTrack!.id) {
        return { ...t, clips: [...t.clips, newClip] };
      }
      return t;
    });

    onUpdateTracks(updatedTracks);

    // Expand project duration if needed
    if (startTime + duration > project.duration) {
      onUpdateProjectDuration(Math.ceil(startTime + duration + 2));
    }
  };

  // --- AI SCRIPT TO VIDEO HANDLER ---
  const handleGenerateAIVideo = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAiVideo(true);
    setAiGenStatus('Analyzing prompt and structuring story arcs...');

    try {
      await new Promise(r => setTimeout(r, 600));
      setAiGenStatus('Generating cinematic scenes and script narration...');
      const result = await api.generateStoryboard(aiPrompt, aiDuration, aiStyle, project.aspectRatio);

      setAiGenStatus('Assembling multi-track timeline...');
      await new Promise(r => setTimeout(r, 400));

      // Build video, text, and audio clips from scenes
      let currentOffset = 0;
      const videoClips: Clip[] = [];
      const textClips: Clip[] = [];

      result.scenes.forEach((scene, idx) => {
        const sceneDur = scene.duration;

        // Visual clip (Image or matched stock video)
        videoClips.push({
          id: `ai-vis-${idx}-${Date.now().toString(36)}`,
          title: `Scene ${scene.sceneNumber}: ${scene.visualPrompt.slice(0, 24)}...`,
          type: 'image',
          url: scene.generatedImageUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
          startTime: currentOffset,
          duration: sceneDur,
          opacity: 1,
          motion: {
            type: idx % 2 === 0 ? 'ken-burns-in' : 'pan-right',
            intensity: 0.2
          },
          filters: {
            brightness: 105,
            contrast: 115,
            saturation: 125,
            hueRotate: 0,
            preset: 'cinematic-teal-orange'
          }
        });

        // Subtitle caption clip
        textClips.push({
          id: `ai-txt-${idx}-${Date.now().toString(36)}`,
          title: `Caption ${scene.sceneNumber}`,
          type: 'text',
          text: scene.caption || scene.script,
          startTime: currentOffset + 0.3,
          duration: Math.max(1.5, sceneDur - 0.6),
          fontSize: 42,
          fontColor: '#facc15',
          fontFamily: 'Inter',
          fontWeight: 'bold',
          backgroundColor: 'rgba(0,0,0,0.8)',
          xPosition: 50,
          yPosition: 80,
          animation: 'fade'
        });

        currentOffset += sceneDur;
      });

      // Background music clip
      const audioClips: Clip[] = [
        {
          id: `ai-audio-${Date.now().toString(36)}`,
          title: 'Cinematic Atmosphere Soundtrack',
          type: 'audio',
          url: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
          startTime: 0,
          duration: currentOffset,
          volume: 0.7
        }
      ];

      // Assemble new tracks
      const newTracks: Track[] = [
        {
          id: `track-video-${Date.now().toString(36)}`,
          name: 'AI Generated Scenes',
          type: 'video',
          clips: videoClips
        },
        {
          id: `track-text-${Date.now().toString(36)}`,
          name: 'AI Subtitles & Captions',
          type: 'text',
          clips: textClips
        },
        {
          id: `track-audio-${Date.now().toString(36)}`,
          name: 'Soundtrack & Voice',
          type: 'audio',
          clips: audioClips
        }
      ];

      onUpdateTracks(newTracks);
      onUpdateProjectDuration(Math.ceil(currentOffset));
      setAiGenStatus('Complete!');
    } catch (err: any) {
      console.error(err);
      alert('AI Generation error: ' + (err.message || 'Failed'));
    } finally {
      setIsGeneratingAiVideo(false);
      setAiGenStatus('');
    }
  };

  // --- AI VOICE OVER (TTS) HANDLER ---
  const handlePreviewTTS = () => {
    if (!window.speechSynthesis) {
      alert('Browser Speech Synthesis API is not supported in this browser');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(ttsText);
    utterance.pitch = ttsPitch;
    utterance.rate = ttsSpeed;
    window.speechSynthesis.speak(utterance);
  };

  const handleAddTTSClip = () => {
    if (!ttsText.trim()) return;
    const words = ttsText.trim().split(/\s+/).length;
    const estDuration = Math.max(2, Number(((words / (140 * ttsSpeed)) * 60).toFixed(1)));

    // Use speech synthesis sound URL or simulated ambient tone
    addClipToTrack({
      title: `AI Voice (${ttsVoice}): "${ttsText.slice(0, 20)}..."`,
      type: 'audio',
      url: 'https://cdn.freesound.org/previews/608/608645_11861866-lq.mp3',
      duration: estDuration,
      volume: 1
    }, 'audio');

    // Also auto-add synchronized subtitle block
    addClipToTrack({
      title: `Voice Caption`,
      type: 'text',
      text: ttsText,
      duration: estDuration,
      fontSize: 40,
      fontColor: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.75)',
      yPosition: 82,
      animation: 'slide-up'
    }, 'text');
  };

  // --- NORMAL VOICE RECORDER (MIC) HANDLER ---
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const recordedDur = Math.max(1, recordingSeconds);

        addClipToTrack({
          title: `Mic Voiceover (${recordedDur}s)`,
          type: 'audio',
          url: audioUrl,
          duration: recordedDur,
          volume: 1
        }, 'audio');

        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Could not access microphone. Please ensure microphone permissions are granted.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    }
  };

  // --- SUBTITLE HANDLERS ---
  const handleAutoTranscribeSubtitles = () => {
    setIsGeneratingSubtitles(true);
    setTimeout(() => {
      // Find duration of video or audio tracks
      const totalDur = project.duration;
      const count = Math.max(2, Math.floor(totalDur / 4));
      const segmentDur = totalDur / count;

      const demoPhrases = [
        "Create high-converting videos faster with AI.",
        "Add dynamic visuals and professional sound effects.",
        "Every single detail is customizable in real time.",
        "Export in ultra-clear 4K resolution with one click!"
      ];

      const newSubtitles: Clip[] = [];
      for (let i = 0; i < count; i++) {
        newSubtitles.push({
          id: `sub-${Date.now().toString(36)}-${i}`,
          title: `Subtitle ${i + 1}`,
          type: 'text',
          text: demoPhrases[i % demoPhrases.length],
          startTime: Number((i * segmentDur).toFixed(1)),
          duration: Number((segmentDur - 0.3).toFixed(1)),
          fontSize: subtitleStyle === 'tiktok' ? 44 : 36,
          fontColor: subtitleStyle === 'tiktok' ? '#facc15' : '#ffffff',
          backgroundColor: subtitleStyle === 'cyber' ? 'rgba(15,23,42,0.85)' : 'rgba(0,0,0,0.8)',
          fontWeight: '900',
          yPosition: 80,
          xPosition: 50,
          animation: subtitleStyle === 'tiktok' ? 'bounce' : 'fade'
        });
      }

      let textTrack = project.data.tracks.find(t => t.type === 'text');
      let updatedTracks = [...project.data.tracks];

      if (textTrack) {
        updatedTracks = updatedTracks.map(t => t.id === textTrack!.id ? { ...t, clips: [...t.clips, ...newSubtitles] } : t);
      } else {
        updatedTracks.push({
          id: `track-text-${Date.now()}`,
          name: 'Auto Subtitles',
          type: 'text',
          clips: newSubtitles
        });
      }

      onUpdateTracks(updatedTracks);
      setIsGeneratingSubtitles(false);
    }, 1200);
  };

  const handleAddManualSubtitle = () => {
    if (!manualSubtitleText.trim()) return;
    addClipToTrack({
      title: 'Subtitle Block',
      type: 'text',
      text: manualSubtitleText,
      duration: 3.5,
      fontSize: 40,
      fontColor: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.7)',
      yPosition: 80,
      animation: 'fade'
    }, 'text');
  };

  // --- IMAGE TO VIDEO ANIMATION HANDLER ---
  const handleAddMotionClip = () => {
    addClipToTrack({
      title: `Motion Photo (${motionType})`,
      type: 'image',
      url: motionImage,
      duration: motionDuration,
      motion: {
        type: motionType,
        intensity: 0.25
      },
      filters: {
        brightness: 105,
        contrast: 110,
        saturation: 120,
        hueRotate: 0
      }
    }, 'video');
  };

  // --- APPLY ENHANCEMENT PRESET TO ALL VIDEO CLIPS ---
  const handleApplyPreset = (preset: EnhancementProfile) => {
    setSelectedPresetId(preset.id);
    const updatedTracks = project.data.tracks.map(t => {
      if (t.type !== 'video') return t;
      return {
        ...t,
        clips: t.clips.map(c => ({
          ...c,
          filters: { ...preset.filters, preset: preset.id }
        }))
      };
    });
    onUpdateTracks(updatedTracks);
  };

  // Audio preview toggle
  const toggleAudioPreview = (url: string) => {
    if (previewingAudio === url) {
      if (audioPreviewRef.current) audioPreviewRef.current.pause();
      setPreviewingAudio(null);
    } else {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.src = url;
        audioPreviewRef.current.play();
      }
      setPreviewingAudio(url);
    }
  };

  return (
    <div className="w-80 md:w-96 border-r border-studio-800 bg-studio-900/95 backdrop-blur-md flex z-20 shrink-0 select-none overflow-hidden">
      <audio ref={audioPreviewRef} onEnded={() => setPreviewingAudio(null)} className="hidden" />

      {/* Vertical Navigation Bar */}
      <div className="w-16 border-r border-studio-800 bg-studio-950 flex flex-col items-center py-3 gap-2 shrink-0">
        {[
          { id: 'ai-video', label: 'AI Studio', icon: Wand2, badge: 'AI' },
          { id: 'media', label: 'Uploads', icon: FolderOpen },
          { id: 'subtitles', label: 'Captions', icon: Type, badge: 'Auto' },
          { id: 'voiceover', label: 'AI Voice', icon: Volume2 },
          { id: 'recorder', label: 'Record', icon: Mic },
          { id: 'image-to-video', label: 'Motion', icon: ImageIcon },
          { id: 'enhance', label: 'Enhance', icon: Sparkles },
          { id: 'stock', label: 'Stock', icon: Music },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative group ${
                isActive
                  ? 'bg-brand-violet text-white shadow-lg shadow-brand-violet/30'
                  : 'text-studio-400 hover:text-white hover:bg-studio-850'
              }`}
              title={tab.label}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-medium leading-none">{tab.label}</span>
              {tab.badge && (
                <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded bg-gradient-to-r from-brand-pink to-brand-amber text-[8px] font-bold text-white shadow">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      <div className="flex-1 flex flex-col overflow-y-auto p-4 custom-scrollbar">
        {/* --- TAB: AI VIDEO GENERATOR --- */}
        {activeTab === 'ai-video' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-violet to-brand-pink flex items-center justify-center">
                  <Wand2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Script to Video</h3>
                  <p className="text-[11px] text-studio-400">Generate full video sequences in seconds</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                100% Free
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-studio-300 block mb-1">
                  Video Topic or Prompt
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={3}
                  className="w-full bg-studio-800 border border-studio-700 rounded-xl p-2.5 text-xs text-white placeholder-studio-500 focus:border-brand-violet outline-none resize-none"
                  placeholder="e.g. 5 Productivity Hacks for Developers in 2026..."
                />
              </div>

              {/* Quick Prompt Ideas */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  '🚀 5 AI Tools in 2026',
                  '🌊 Ocean Mysteries',
                  '⚡ Tech Product Teaser',
                  '💡 Motivation & Mindset'
                ].map((idea) => (
                  <button
                    key={idea}
                    onClick={() => setAiPrompt(idea.replace(/^[^\s]+\s/, ''))}
                    className="text-[10px] px-2 py-1 rounded-md bg-studio-800 hover:bg-studio-700 text-studio-300 hover:text-white transition-colors border border-studio-700/60"
                  >
                    {idea}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-studio-400 block mb-1">Target Duration</label>
                  <select
                    value={aiDuration}
                    onChange={(e) => setAiDuration(Number(e.target.value))}
                    className="w-full bg-studio-800 border border-studio-700 text-xs text-white rounded-lg p-2 outline-none"
                  >
                    <option value={10}>10 Seconds (Hook)</option>
                    <option value={15}>15 Seconds (Shorts/Reel)</option>
                    <option value={20}>20 Seconds (Explainer)</option>
                    <option value={30}>30 Seconds (Commercial)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-studio-400 block mb-1">Visual Style</label>
                  <select
                    value={aiStyle}
                    onChange={(e) => setAiStyle(e.target.value)}
                    className="w-full bg-studio-800 border border-studio-700 text-xs text-white rounded-lg p-2 outline-none"
                  >
                    <option value="modern-cinematic">Modern Cinematic</option>
                    <option value="cyberpunk-neon">Cyberpunk Neon</option>
                    <option value="minimalist-clean">Minimalist Clean</option>
                    <option value="documentary-nature">Documentary Nature</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateAIVideo}
                disabled={isGeneratingAiVideo || !aiPrompt.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-violet via-brand-pink to-brand-cyan text-white text-xs font-bold shadow-lg shadow-brand-violet/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGeneratingAiVideo ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating Video...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate AI Video Storyboard</span>
                  </>
                )}
              </button>

              {aiGenStatus && (
                <div className="p-2.5 rounded-lg bg-studio-800/80 border border-brand-violet/30 text-[11px] text-brand-cyan flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
                  <span>{aiGenStatus}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB: MEDIA UPLOADS --- */}
        {activeTab === 'media' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Your Media Library</h3>
              <span className="text-[10px] text-studio-400">{uploadedAssets.length} files</span>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-studio-700 hover:border-brand-violet/80 bg-studio-850/50 hover:bg-studio-800/40 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-brand-violet/10 group-hover:bg-brand-violet/20 flex items-center justify-center text-brand-violet transition-colors">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-slate-200">
                Click to upload video, audio or image
              </p>
              <p className="text-[10px] text-studio-500">MP4, WebM, MP3, WAV, PNG, JPG (up to 500MB)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,audio/*,image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Asset List */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-studio-400 uppercase tracking-wider block">
                Project Assets
              </span>

              {uploadedAssets.map((asset, index) => (
                <div 
                  key={index}
                  className="p-2.5 rounded-xl bg-studio-800 border border-studio-700/60 flex items-center justify-between group hover:border-studio-600 transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {asset.type === 'video' ? (
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                        <FolderOpen className="w-4 h-4" />
                      </div>
                    ) : asset.type === 'audio' ? (
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Music className="w-4 h-4" />
                      </div>
                    ) : (
                      <img src={asset.url} alt={asset.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                    )}
                    <div className="truncate">
                      <div className="text-xs font-medium text-white truncate">{asset.name}</div>
                      <div className="text-[10px] text-studio-400 capitalize">{asset.type}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => addClipToTrack({
                      title: asset.name,
                      type: asset.type as any,
                      url: asset.url,
                      duration: asset.type === 'image' ? 5 : 8
                    }, asset.type === 'audio' ? 'audio' : 'video')}
                    className="p-1.5 rounded-lg bg-studio-700 hover:bg-brand-violet text-studio-300 hover:text-white transition-colors"
                    title="Add to Timeline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB: SUBTITLES & CAPTIONS --- */}
        {activeTab === 'subtitles' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Subtitles & Captions</h3>
                <p className="text-[11px] text-studio-400">Viral word-by-word highlights and auto-sync</p>
              </div>
            </div>

            {/* Auto Transcribe Action */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-brand-violet/20 to-brand-cyan/10 border border-brand-violet/30 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-cyan" />
                <span className="text-xs font-bold text-white">AI Auto-Transcribe</span>
              </div>
              <p className="text-[11px] text-studio-300 leading-relaxed">
                Transcribe voiceover and dialogue automatically with timed subtitle blocks.
              </p>
              <button
                onClick={handleAutoTranscribeSubtitles}
                disabled={isGeneratingSubtitles}
                className="mt-1 py-2 px-3 rounded-lg bg-brand-violet hover:bg-brand-purple text-white text-xs font-semibold shadow flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isGeneratingSubtitles ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Transcribing Audio...</span>
                  </>
                ) : (
                  <>
                    <Type className="w-3.5 h-3.5" />
                    <span>Auto-Generate Subtitles</span>
                  </>
                )}
              </button>
            </div>

            {/* Subtitle Style Presets */}
            <div>
              <label className="text-[11px] font-semibold text-studio-400 uppercase tracking-wider block mb-2">
                Caption Style Preset
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'tiktok', name: 'Viral Yellow', color: 'text-amber-300', bg: 'bg-black/90' },
                  { id: 'netflix', name: 'Clean White', color: 'text-white', bg: 'bg-black/60' },
                  { id: 'cyber', name: 'Cyber Neon', color: 'text-cyan-300', bg: 'bg-slate-900' },
                  { id: 'karaoke', name: 'Karaoke Pop', color: 'text-pink-400', bg: 'bg-purple-950' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSubtitleStyle(s.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      subtitleStyle === s.id
                        ? 'border-brand-violet bg-brand-violet/15 ring-1 ring-brand-violet'
                        : 'border-studio-700 bg-studio-800/80 hover:bg-studio-800'
                    }`}
                  >
                    <div className={`text-xs font-black ${s.color} ${s.bg} p-1 rounded mb-1`}>
                      WORD SYNC
                    </div>
                    <div className="text-[10px] text-studio-400 font-medium">{s.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Subtitle Add */}
            <div className="space-y-2 border-t border-studio-800 pt-3">
              <label className="text-xs font-semibold text-studio-300 block">
                Add Custom Caption
              </label>
              <input
                type="text"
                value={manualSubtitleText}
                onChange={(e) => setManualSubtitleText(e.target.value)}
                className="w-full bg-studio-800 border border-studio-700 rounded-lg p-2 text-xs text-white placeholder-studio-500 outline-none"
                placeholder="Enter caption text..."
              />
              <button
                onClick={handleAddManualSubtitle}
                className="w-full py-2 rounded-lg bg-studio-700 hover:bg-studio-600 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Insert at Playhead</span>
              </button>
            </div>
          </div>
        )}

        {/* --- TAB: AI VOICEOVER (TTS) --- */}
        {activeTab === 'voiceover' && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">AI Voice-Over Generator</h3>
              <p className="text-[11px] text-studio-400">Natural sounding multi-accent voice narration</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-studio-300 block mb-1">
                  Narration Script
                </label>
                <textarea
                  value={ttsText}
                  onChange={(e) => setTtsText(e.target.value)}
                  rows={3}
                  className="w-full bg-studio-800 border border-studio-700 rounded-xl p-2.5 text-xs text-white outline-none resize-none"
                  placeholder="Type script to speak..."
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-studio-400 block mb-1">Select Voice</label>
                <select
                  value={ttsVoice}
                  onChange={(e) => setTtsVoice(e.target.value)}
                  className="w-full bg-studio-800 border border-studio-700 text-xs text-white rounded-lg p-2 outline-none"
                >
                  <option value="Alex">Alex (Natural American - Energetic)</option>
                  <option value="Sarah">Sarah (Warm & Engaging - Storyteller)</option>
                  <option value="Marcus">Marcus (Deep Cinema Narrator)</option>
                  <option value="Elena">Elena (British Crisp & Professional)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex justify-between text-[11px] text-studio-400 mb-1">
                    <span>Speed</span>
                    <span>{ttsSpeed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.5"
                    step="0.1"
                    value={ttsSpeed}
                    onChange={(e) => setTtsSpeed(parseFloat(e.target.value))}
                    className="w-full accent-brand-cyan h-1 bg-studio-700 rounded"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-studio-400 mb-1">
                    <span>Pitch</span>
                    <span>{ttsPitch}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.3"
                    step="0.1"
                    value={ttsPitch}
                    onChange={(e) => setTtsPitch(parseFloat(e.target.value))}
                    className="w-full accent-brand-violet h-1 bg-studio-700 rounded"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handlePreviewTTS}
                  className="flex-1 py-2 rounded-lg bg-studio-800 hover:bg-studio-700 text-studio-200 text-xs font-medium border border-studio-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Preview Voice</span>
                </button>
                <button
                  onClick={handleAddTTSClip}
                  className="flex-1 py-2 rounded-lg bg-brand-violet hover:bg-brand-purple text-white text-xs font-bold shadow transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Timeline</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: MICROPHONE VOICE RECORDER --- */}
        {activeTab === 'recorder' && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Live Microphone Voiceover</h3>
              <p className="text-[11px] text-studio-400">Record direct narration synced to playhead</p>
            </div>

            <div className="p-6 rounded-2xl bg-studio-850 border border-studio-700/80 flex flex-col items-center justify-center gap-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-rose-500/20 text-rose-500 ring-4 ring-rose-500/30 animate-pulse'
                  : 'bg-studio-800 text-studio-300'
              }`}>
                <Mic className="w-8 h-8" />
              </div>

              {/* Time Counter */}
              <div className="font-mono text-xl font-bold text-white">
                {Math.floor(recordingSeconds / 60).toString().padStart(2, '0')}:
                {(recordingSeconds % 60).toString().padStart(2, '0')}
              </div>

              {isRecording ? (
                <button
                  onClick={handleStopRecording}
                  className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/30 transition-all flex items-center gap-2"
                >
                  <div className="w-3 h-3 bg-white rounded-sm" />
                  <span>Stop & Add to Timeline</span>
                </button>
              ) : (
                <button
                  onClick={handleStartRecording}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-violet to-brand-cyan hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-brand-violet/30 transition-all flex items-center gap-2"
                >
                  <Radio className="w-4 h-4" />
                  <span>Start Recording</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* --- TAB: IMAGE TO VIDEO MOTION --- */}
        {activeTab === 'image-to-video' && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Image to Video Motion</h3>
              <p className="text-[11px] text-studio-400">Bring still images alive with dynamic Ken Burns motion</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-studio-300 block mb-1">Pick an Image</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80'
                  ].map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Choice"
                      onClick={() => setMotionImage(img)}
                      className={`h-16 w-full object-cover rounded-lg cursor-pointer border-2 transition-all ${
                        motionImage === img ? 'border-brand-cyan scale-[1.02]' : 'border-transparent hover:opacity-80'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-studio-400 block mb-1">Camera Movement</label>
                <select
                  value={motionType}
                  onChange={(e) => setMotionType(e.target.value as any)}
                  className="w-full bg-studio-800 border border-studio-700 text-xs text-white rounded-lg p-2 outline-none"
                >
                  <option value="ken-burns-in">Ken Burns: Slow Zoom In</option>
                  <option value="ken-burns-out">Ken Burns: Slow Zoom Out</option>
                  <option value="pan-left">Cinematic Pan Left</option>
                  <option value="pan-right">Cinematic Pan Right</option>
                  <option value="pulse">Dynamic Depth Pulse</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-studio-400 block mb-1">Duration: {motionDuration}s</label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={motionDuration}
                  onChange={(e) => setMotionDuration(parseInt(e.target.value))}
                  className="w-full accent-brand-violet h-1 bg-studio-700 rounded"
                />
              </div>

              <button
                onClick={handleAddMotionClip}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-violet to-brand-cyan text-white text-xs font-bold shadow-lg shadow-brand-violet/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Create Animated Video Clip</span>
              </button>
            </div>
          </div>
        )}

        {/* --- TAB: AI ENHANCEMENT & PRESETS --- */}
        {activeTab === 'enhance' && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">AI Color & Grading</h3>
              <p className="text-[11px] text-studio-400">Apply cinema-grade tone curves and enhancements</p>
            </div>

            <div className="space-y-2">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedPresetId === preset.id
                      ? 'border-brand-violet bg-brand-violet/15 ring-1 ring-brand-violet'
                      : 'border-studio-700/60 bg-studio-800 hover:bg-studio-750'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{preset.name}</span>
                    {selectedPresetId === preset.id && (
                      <Check className="w-3.5 h-3.5 text-brand-cyan" />
                    )}
                  </div>
                  <p className="text-[10px] text-studio-400 leading-normal">{preset.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB: STOCK MEDIA & AUDIO --- */}
        {activeTab === 'stock' && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Royalty-Free Stock Media</h3>
              <p className="text-[11px] text-studio-400">Curated videos, background music & sound effects</p>
            </div>

            {/* Type Filter Buttons */}
            <div className="grid grid-cols-3 gap-1.5 bg-studio-800/80 p-1 rounded-xl">
              {(['video', 'music', 'sfx'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setStockType(t)}
                  className={`py-1 text-[11px] font-semibold rounded-lg capitalize transition-colors ${
                    stockType === t
                      ? 'bg-brand-violet text-white shadow'
                      : 'text-studio-400 hover:text-white'
                  }`}
                >
                  {t === 'music' ? 'Music' : t === 'sfx' ? 'SFX' : 'Videos'}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-studio-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={stockSearch}
                onChange={(e) => setStockSearch(e.target.value)}
                placeholder="Search media..."
                className="w-full bg-studio-800 border border-studio-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-studio-500 outline-none"
              />
            </div>

            {/* Media Items */}
            <div className="space-y-2">
              {stockType === 'video' && stockVideos.map((item) => (
                <div key={item.id} className="p-2 rounded-xl bg-studio-800 border border-studio-700/60 flex items-center justify-between group">
                  <div className="flex items-center gap-2 truncate">
                    <img src={item.thumbnail} alt={item.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <div className="truncate">
                      <div className="text-xs font-medium text-white truncate">{item.title}</div>
                      <div className="text-[10px] text-studio-400">{item.duration}s • {item.category}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => addClipToTrack({
                      title: item.title,
                      type: 'video',
                      url: item.url,
                      duration: item.duration || 8
                    }, 'video')}
                    className="p-1.5 rounded-lg bg-studio-700 hover:bg-brand-violet text-studio-300 hover:text-white transition-colors"
                    title="Add to Timeline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {(stockType === 'music' || stockType === 'sfx') && (stockType === 'music' ? stockMusic : stockSfx).map((item) => (
                <div key={item.id} className="p-2.5 rounded-xl bg-studio-800 border border-studio-700/60 flex items-center justify-between group">
                  <div className="flex items-center gap-2 truncate">
                    <button
                      onClick={() => toggleAudioPreview(item.url)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        previewingAudio === item.url ? 'bg-brand-cyan text-studio-950' : 'bg-studio-700 text-studio-300 hover:text-white'
                      }`}
                    >
                      {previewingAudio === item.url ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <div className="truncate">
                      <div className="text-xs font-medium text-white truncate">{item.title}</div>
                      <div className="text-[10px] text-studio-400">{item.genre || item.category || `${item.duration}s`}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => addClipToTrack({
                      title: item.title,
                      type: 'audio',
                      url: item.url,
                      duration: item.duration || 10
                    }, 'audio')}
                    className="p-1.5 rounded-lg bg-studio-700 hover:bg-brand-violet text-studio-300 hover:text-white transition-colors"
                    title="Add to Audio Track"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
