import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Repeat, 
  Sparkles,
  FastForward
} from 'lucide-react';
import { Project, Clip, AspectRatio } from '../../types';

interface VideoCanvasProps {
  project: Project;
  currentTime: number;
  isPlaying: boolean;
  onTimeUpdate: (time: number) => void;
  onTogglePlay: () => void;
  selectedClipId: string | null;
  onSelectClip: (clipId: string | null) => void;
}

export const VideoCanvas: React.FC<VideoCanvasProps> = ({
  project,
  currentTime,
  isPlaying,
  onTimeUpdate,
  onTogglePlay,
  selectedClipId,
  onSelectClip
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoElementsRef = useRef<Map<string, HTMLVideoElement>>(new Map());
  const imageElementsRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);

  // Aspect ratio dimensions calculator
  const getCanvasDimensions = (aspectRatio: AspectRatio) => {
    switch (aspectRatio) {
      case '9:16':
        return { width: 720, height: 1280 };
      case '1:1':
        return { width: 1080, height: 1080 };
      case '4:5':
        return { width: 1080, height: 1350 };
      case '21:9':
        return { width: 1920, height: 820 };
      case '16:9':
      default:
        return { width: 1920, height: 1080 };
    }
  };

  const { width: targetWidth, height: targetHeight } = getCanvasDimensions(project.aspectRatio);

  // Format timecode (e.g., 00:04.2)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  // Pre-load media elements
  useEffect(() => {
    const videoTracks = project.data.tracks.filter(t => t.type === 'video');
    const audioTracks = project.data.tracks.filter(t => t.type === 'audio');

    // Preload videos
    videoTracks.forEach(track => {
      track.clips.forEach(clip => {
        if (clip.url && (clip.type === 'video' || clip.url.includes('.mp4') || clip.url.includes('.webm'))) {
          if (!videoElementsRef.current.has(clip.id)) {
            const vid = document.createElement('video');
            vid.src = clip.url;
            vid.crossOrigin = 'anonymous';
            vid.preload = 'auto';
            vid.muted = isMuted;
            vid.playsInline = true;
            videoElementsRef.current.set(clip.id, vid);
          }
        } else if (clip.url && (clip.type === 'image' || clip.url.match(/\.(png|jpg|jpeg|webp|gif)/i))) {
          if (!imageElementsRef.current.has(clip.id)) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = clip.url;
            imageElementsRef.current.set(clip.id, img);
          }
        }
      });
    });

    // Preload audio
    audioTracks.forEach(track => {
      track.clips.forEach(clip => {
        if (clip.url && !audioElementsRef.current.has(clip.id)) {
          const aud = document.createElement('audio');
          aud.src = clip.url;
          aud.crossOrigin = 'anonymous';
          aud.preload = 'auto';
          audioElementsRef.current.set(clip.id, aud);
        }
      });
    });
  }, [project.data.tracks, isMuted]);

  // Sync video & audio playback with currentTime
  useEffect(() => {
    project.data.tracks.forEach(track => {
      if (track.hidden || track.muted) return;

      track.clips.forEach(clip => {
        const isActive = currentTime >= clip.startTime && currentTime <= (clip.startTime + clip.duration);
        const relativeTime = (currentTime - clip.startTime) * (clip.speed || 1) + (clip.startOffset || 0);

        if (clip.type === 'video' && videoElementsRef.current.has(clip.id)) {
          const vid = videoElementsRef.current.get(clip.id)!;
          vid.volume = isMuted ? 0 : (clip.volume ?? 1) * volume;
          if (isActive) {
            if (Math.abs(vid.currentTime - relativeTime) > 0.3) {
              vid.currentTime = Math.max(0, relativeTime);
            }
            if (isPlaying && vid.paused) {
              vid.play().catch(() => {});
            } else if (!isPlaying && !vid.paused) {
              vid.pause();
            }
          } else {
            if (!vid.paused) vid.pause();
          }
        }

        if (clip.type === 'audio' && audioElementsRef.current.has(clip.id)) {
          const aud = audioElementsRef.current.get(clip.id)!;
          aud.volume = isMuted ? 0 : (clip.volume ?? 1) * volume;
          if (isActive) {
            if (Math.abs(aud.currentTime - relativeTime) > 0.3) {
              aud.currentTime = Math.max(0, relativeTime);
            }
            if (isPlaying && aud.paused) {
              aud.play().catch(() => {});
            } else if (!isPlaying && !aud.paused) {
              aud.pause();
            }
          } else {
            if (!aud.paused) aud.pause();
          }
        }
      });
    });
  }, [currentTime, isPlaying, isMuted, volume, project.data.tracks]);

  // Render loop on HTML5 Canvas
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#05070a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render active video/image tracks
    const videoTracks = project.data.tracks.filter(t => t.type === 'video' && !t.hidden);
    
    videoTracks.forEach(track => {
      track.clips.forEach(clip => {
        const isActive = currentTime >= clip.startTime && currentTime <= (clip.startTime + clip.duration);
        if (!isActive) return;

        const progressInClip = (currentTime - clip.startTime) / clip.duration; // 0 to 1

        ctx.save();

        // Clip Opacity
        ctx.globalAlpha = clip.opacity !== undefined ? clip.opacity : 1;

        // Apply filters
        const f = clip.filters || { brightness: 100, contrast: 100, saturation: 100, hueRotate: 0 };
        ctx.filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%) hue-rotate(${f.hueRotate}deg)${f.sepia ? ` sepia(${f.sepia * 100}%)` : ''}`;

        // Render Video Clip
        if (clip.type === 'video' && videoElementsRef.current.has(clip.id)) {
          const vid = videoElementsRef.current.get(clip.id)!;
          if (vid.readyState >= 2) {
            ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
          } else {
            // Draw stylish animated placeholder while buffering
            ctx.fillStyle = '#1e1b4b';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#818cf8';
            ctx.font = '24px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(`Loading: ${clip.title}`, canvas.width / 2, canvas.height / 2);
          }
        }

        // Render Image Clip with Ken Burns Motion
        if ((clip.type === 'image' || clip.url?.match(/\.(png|jpg|jpeg|webp)/i)) && imageElementsRef.current.has(clip.id)) {
          const img = imageElementsRef.current.get(clip.id)!;
          if (img.complete) {
            let scale = 1.0;
            let translateX = 0;
            let translateY = 0;

            const motionType = clip.motion?.type || 'ken-burns-in';
            const intensity = clip.motion?.intensity || 0.15;

            if (motionType === 'ken-burns-in') {
              scale = 1.0 + (progressInClip * intensity);
            } else if (motionType === 'ken-burns-out') {
              scale = 1.0 + intensity - (progressInClip * intensity);
            } else if (motionType === 'pan-left') {
              translateX = -progressInClip * (canvas.width * 0.1);
              scale = 1.1;
            } else if (motionType === 'pan-right') {
              translateX = progressInClip * (canvas.width * 0.1);
              scale = 1.1;
            } else if (motionType === 'pulse') {
              scale = 1.0 + Math.sin(progressInClip * Math.PI) * (intensity * 0.5);
            }

            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.scale(scale, scale);
            ctx.translate(-canvas.width / 2 + translateX, -canvas.height / 2 + translateY);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
        }

        // Draw Vignette if configured
        if (f.vignette && f.vignette > 0) {
          const radius = Math.max(canvas.width, canvas.height) * 0.7;
          const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, radius * 0.4,
            canvas.width / 2, canvas.height / 2, radius
          );
          gradient.addColorStop(0, 'rgba(0,0,0,0)');
          gradient.addColorStop(1, `rgba(0,0,0,${Math.min(0.9, f.vignette)})`);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.restore();
      });
    });

    // Render Text & Subtitle tracks
    const textTracks = project.data.tracks.filter(t => t.type === 'text' && !t.hidden);
    
    textTracks.forEach(track => {
      track.clips.forEach(clip => {
        const isActive = currentTime >= clip.startTime && currentTime <= (clip.startTime + clip.duration);
        if (!isActive || !clip.text) return;

        ctx.save();
        const progressInClip = (currentTime - clip.startTime) / clip.duration;

        // Coordinates
        const x = (clip.xPosition !== undefined ? clip.xPosition / 100 : 0.5) * canvas.width;
        let y = (clip.yPosition !== undefined ? clip.yPosition / 100 : 0.75) * canvas.height;

        // Animation calculations
        let alpha = 1.0;
        let scale = 1.0;
        if (clip.animation === 'fade') {
          if (progressInClip < 0.15) alpha = progressInClip / 0.15;
          else if (progressInClip > 0.85) alpha = (1 - progressInClip) / 0.15;
        } else if (clip.animation === 'slide-up') {
          if (progressInClip < 0.15) {
            y += (1 - progressInClip / 0.15) * 40;
            alpha = progressInClip / 0.15;
          }
        } else if (clip.animation === 'zoom') {
          if (progressInClip < 0.2) {
            scale = 0.6 + (progressInClip / 0.2) * 0.4;
            alpha = progressInClip / 0.2;
          }
        } else if (clip.animation === 'bounce') {
          if (progressInClip < 0.2) {
            const p = progressInClip / 0.2;
            scale = 1 + Math.sin(p * Math.PI) * 0.25;
          }
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.font = `${clip.fontWeight || 'bold'} ${clip.fontSize || 42}px ${clip.fontFamily || 'Inter'}, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const lines = clip.text.split('\n');
        const lineHeight = (clip.fontSize || 42) * 1.25;
        const totalHeight = lines.length * lineHeight;
        const startY = y - totalHeight / 2 + lineHeight / 2;

        lines.forEach((line, index) => {
          const lineY = startY + index * lineHeight;
          const textMetrics = ctx.measureText(line);
          const paddingX = 24;
          const paddingY = 12;

          // Draw Background Box if present
          if (clip.backgroundColor && clip.backgroundColor !== 'transparent') {
            ctx.fillStyle = clip.backgroundColor;
            ctx.beginPath();
            ctx.roundRect(
              x - textMetrics.width / 2 - paddingX,
              lineY - lineHeight / 2 + paddingY / 2,
              textMetrics.width + paddingX * 2,
              lineHeight,
              12
            );
            ctx.fill();
          }

          // Subtle text shadow for high legibility
          ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 3;

          // Fill text
          ctx.fillStyle = clip.fontColor || '#ffffff';
          ctx.fillText(line, x, lineY);
        });

        ctx.restore();
      });
    });
  }, [currentTime, project, isMuted, volume]);

  // Canvas render animation frame
  useEffect(() => {
    let animId: number;
    const loop = () => {
      renderFrame();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [renderFrame]);

  const currentTimeRef = useRef(currentTime);
  currentTimeRef.current = currentTime;

  // Playback timer progression
  useEffect(() => {
    if (!isPlaying) return;

    const interval = 1000 / 30; // 30 FPS update
    const timer = setInterval(() => {
      const nextTime = currentTimeRef.current + 1 / 30;
      if (nextTime >= project.duration) {
        if (isLooping) {
          onTimeUpdate(0);
        } else {
          onTogglePlay();
          onTimeUpdate(project.duration);
        }
      } else {
        onTimeUpdate(nextTime);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, isLooping, project.duration, onTimeUpdate, onTogglePlay]);

  return (
    <div className="flex-1 flex flex-col bg-studio-950/30 relative overflow-hidden select-none">
      {/* Canvas Viewport Area */}
      <div 
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-4 relative"
      >
        <div 
          className="relative rounded-2xl overflow-hidden shadow-2xl border border-studio-800 bg-black flex items-center justify-center"
          style={{
            aspectRatio: project.aspectRatio.replace(':', '/'),
            maxHeight: 'calc(100% - 10px)',
            maxWidth: 'calc(100% - 10px)',
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8), 0 0 30px rgba(124, 58, 237, 0.1)'
          }}
        >
          <canvas
            ref={canvasRef}
            width={targetWidth}
            height={targetHeight}
            className="w-full h-full object-contain cursor-pointer"
            onClick={onTogglePlay}
          />

          {/* Center Play Overlay Icon when paused */}
          {!isPlaying && (
            <button
              onClick={onTogglePlay}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-studio-900/80 hover:bg-brand-violet text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-2xl group"
              title="Play Video"
            >
              <Play className="w-7 h-7 fill-white translate-x-0.5 text-white" />
            </button>
          )}

          {/* Aspect ratio watermark badge */}
          <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono font-medium text-studio-300">
            {project.aspectRatio} • {targetWidth}x{targetHeight}
          </div>
        </div>
      </div>

      {/* Media Controller Toolbar */}
      <div className="h-12 border-t border-studio-800 bg-studio-900/90 backdrop-blur-md px-6 flex items-center justify-between z-10">
        {/* Left: Timecode Display */}
        <div className="flex items-center gap-3">
          <div className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-studio-800 text-studio-200 border border-studio-700/60">
            <span className="text-brand-cyan">{formatTime(currentTime)}</span>
            <span className="text-studio-500 mx-1">/</span>
            <span className="text-studio-400">{formatTime(project.duration)}</span>
          </div>

          <button
            onClick={() => onTimeUpdate(0)}
            className="p-1.5 rounded-lg text-studio-400 hover:text-white hover:bg-studio-800 transition-colors"
            title="Rewind to start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Playback Transport Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTimeUpdate(Math.max(0, currentTime - 5))}
            className="p-2 rounded-lg text-studio-300 hover:text-white hover:bg-studio-800 transition-colors"
            title="Rewind 5s"
          >
            <span className="text-[10px] font-bold">-5s</span>
          </button>

          <button
            onClick={onTogglePlay}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-violet to-brand-cyan hover:brightness-110 text-white flex items-center justify-center shadow-lg shadow-brand-violet/30 hover:scale-105 active:scale-95 transition-all"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white translate-x-0.5" />
            )}
          </button>

          <button
            onClick={() => onTimeUpdate(Math.min(project.duration, currentTime + 5))}
            className="p-2 rounded-lg text-studio-300 hover:text-white hover:bg-studio-800 transition-colors"
            title="Fast Forward 5s"
          >
            <span className="text-[10px] font-bold">+5s</span>
          </button>
        </div>

        {/* Right: Audio Volume, Loop, Fullscreen */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-lg text-studio-400 hover:text-white hover:bg-studio-800 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-studio-300" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-16 accent-brand-cyan h-1 bg-studio-700 rounded-lg cursor-pointer"
              title="Volume"
            />
          </div>

          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`p-1.5 rounded-lg transition-colors ${
              isLooping ? 'text-brand-cyan bg-brand-cyan/10' : 'text-studio-400 hover:text-white hover:bg-studio-800'
            }`}
            title={isLooping ? 'Looping enabled' : 'Looping disabled'}
          >
            <Repeat className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (containerRef.current) {
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                } else {
                  containerRef.current.requestFullscreen();
                }
              }
            }}
            className="p-1.5 rounded-lg text-studio-400 hover:text-white hover:bg-studio-800 transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
