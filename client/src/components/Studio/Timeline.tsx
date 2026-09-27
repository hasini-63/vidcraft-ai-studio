import React, { useRef, useState } from 'react';
import { 
  Scissors, 
  Trash2, 
  Copy, 
  ZoomIn, 
  ZoomOut, 
  Plus, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Film, 
  Type, 
  Music, 
  Lock, 
  Unlock 
} from 'lucide-react';
import { Project, Track, Clip } from '../../types';

interface TimelineProps {
  project: Project;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  selectedClipId: string | null;
  onSelectClip: (clipId: string | null) => void;
  onUpdateTracks: (tracks: Track[]) => void;
  onSplitClip: () => void;
  onDeleteClip: () => void;
  onDuplicateClip: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  project,
  currentTime,
  onTimeUpdate,
  selectedClipId,
  onSelectClip,
  onUpdateTracks,
  onSplitClip,
  onDeleteClip,
  onDuplicateClip
}) => {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState<number>(60); // pixels per second (zoom level)
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [draggingClip, setDraggingClip] = useState<{
    clipId: string;
    trackId: string;
    startX: number;
    initialStartTime: number;
    type: 'move' | 'trim-start' | 'trim-end';
    initialDuration: number;
    initialOffset: number;
  } | null>(null);

  const totalWidth = Math.max(1000, project.duration * zoom + 150);

  // Time conversion helpers
  const timeToPixels = (time: number) => time * zoom;
  const pixelsToTime = (px: number) => Math.max(0, Math.min(project.duration, px / zoom));

  // Timeline scrubber click / drag
  const handleTimelineMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const scrollLeft = timelineRef.current.scrollLeft;
    const clickX = e.clientX - rect.left + scrollLeft - 180; // 180px for track headers
    if (clickX >= 0) {
      const newTime = pixelsToTime(clickX);
      onTimeUpdate(newTime);
      setIsScrubbing(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isScrubbing && timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const scrollLeft = timelineRef.current.scrollLeft;
      const clickX = e.clientX - rect.left + scrollLeft - 180;
      if (clickX >= 0) {
        onTimeUpdate(pixelsToTime(clickX));
      }
    }

    if (draggingClip) {
      const deltaX = e.clientX - draggingClip.startX;
      const deltaTime = deltaX / zoom;

      const newTracks = project.data.tracks.map(t => {
        if (t.id !== draggingClip.trackId) return t;

        return {
          ...t,
          clips: t.clips.map(c => {
            if (c.id !== draggingClip.clipId) return c;

            if (draggingClip.type === 'move') {
              const newStart = Math.max(0, Number((draggingClip.initialStartTime + deltaTime).toFixed(2)));
              return { ...c, startTime: newStart };
            } else if (draggingClip.type === 'trim-start') {
              const newStart = Math.max(0, Number((draggingClip.initialStartTime + deltaTime).toFixed(2)));
              const newDuration = Math.max(0.5, Number((draggingClip.initialDuration - deltaTime).toFixed(2)));
              const newOffset = Math.max(0, Number((draggingClip.initialOffset + deltaTime).toFixed(2)));
              return { ...c, startTime: newStart, duration: newDuration, startOffset: newOffset };
            } else if (draggingClip.type === 'trim-end') {
              const newDuration = Math.max(0.5, Number((draggingClip.initialDuration + deltaTime).toFixed(2)));
              return { ...c, duration: newDuration };
            }
            return c;
          })
        };
      });

      onUpdateTracks(newTracks);
    }
  };

  const handleMouseUp = () => {
    setIsScrubbing(false);
    setDraggingClip(null);
  };

  // Track toggles
  const toggleTrackMute = (trackId: string) => {
    onUpdateTracks(project.data.tracks.map(t => t.id === trackId ? { ...t, muted: !t.muted } : t));
  };

  const toggleTrackVisibility = (trackId: string) => {
    onUpdateTracks(project.data.tracks.map(t => t.id === trackId ? { ...t, hidden: !t.hidden } : t));
  };

  // Add tracks
  const addTrack = (type: 'video' | 'audio' | 'text') => {
    const trackCount = project.data.tracks.filter(t => t.type === type).length + 1;
    const newTrack: Track = {
      id: `track-${type}-${Date.now().toString(36)}`,
      name: `${type.toUpperCase()} Track ${trackCount}`,
      type,
      clips: []
    };
    onUpdateTracks([...project.data.tracks, newTrack]);
  };

  // Render second marks on ruler
  const rulerTicks = [];
  const step = zoom >= 80 ? 1 : 2;
  for (let sec = 0; sec <= Math.ceil(project.duration); sec += step) {
    rulerTicks.push(
      <div 
        key={sec} 
        className="absolute top-0 bottom-0 border-l border-studio-700/60 flex flex-col justify-between pl-1"
        style={{ left: `${sec * zoom}px` }}
      >
        <span className="text-[10px] font-mono text-studio-400 select-none">
          {sec}s
        </span>
        <div className="h-1.5 w-0.5 bg-studio-600" />
      </div>
    );
  }

  return (
    <div 
      className="h-64 border-t border-studio-800 bg-studio-900 flex flex-col select-none relative"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Timeline Controls & Action Bar */}
      <div className="h-10 border-b border-studio-800 px-4 flex items-center justify-between bg-studio-850/80">
        {/* Left: Editing Tools */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onSplitClip}
            disabled={!selectedClipId}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-studio-300 hover:text-white bg-studio-800 hover:bg-studio-700 disabled:opacity-40 disabled:hover:bg-studio-800 transition-colors"
            title="Split selected clip at playhead (S)"
          >
            <Scissors className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Split</span>
          </button>

          <button
            onClick={onDuplicateClip}
            disabled={!selectedClipId}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-studio-300 hover:text-white bg-studio-800 hover:bg-studio-700 disabled:opacity-40 disabled:hover:bg-studio-800 transition-colors"
            title="Duplicate selected clip (Ctrl+D)"
          >
            <Copy className="w-3.5 h-3.5 text-brand-purple" />
            <span>Duplicate</span>
          </button>

          <button
            onClick={onDeleteClip}
            disabled={!selectedClipId}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-40 transition-colors"
            title="Delete selected clip (Del)"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>

        {/* Center: Add Track buttons */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => addTrack('video')}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Video Track</span>
          </button>
          <button
            onClick={() => addTrack('text')}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Text Track</span>
          </button>
          <button
            onClick={() => addTrack('audio')}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Audio Track</span>
          </button>
        </div>

        {/* Right: Timeline Zoom */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setZoom(Math.max(25, zoom - 15))}
            className="p-1 rounded text-studio-400 hover:text-white hover:bg-studio-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <input
            type="range"
            min="25"
            max="180"
            value={zoom}
            onChange={(e) => setZoom(parseInt(e.target.value))}
            className="w-20 accent-brand-violet h-1 bg-studio-700 rounded-lg cursor-pointer"
            title="Zoom Level"
          />
          <button 
            onClick={() => setZoom(Math.min(180, zoom + 15))}
            className="p-1 rounded text-studio-400 hover:text-white hover:bg-studio-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Tracks & Scrollable Timeline Container */}
      <div 
        ref={timelineRef}
        className="flex-1 overflow-x-auto overflow-y-auto relative timeline-grid"
      >
        <div 
          className="relative flex flex-col min-h-full"
          style={{ width: `${totalWidth}px` }}
        >
          {/* Timecode Ruler Bar */}
          <div 
            className="h-7 border-b border-studio-800 bg-studio-850 flex relative cursor-pointer"
            onMouseDown={handleTimelineMouseDown}
          >
            {/* Header placeholder */}
            <div className="w-[180px] shrink-0 border-r border-studio-800 bg-studio-900/90 px-3 flex items-center text-[10px] font-semibold text-studio-400 uppercase tracking-wider sticky left-0 z-20">
              Tracks ({project.data.tracks.length})
            </div>
            {/* Ruler ticks */}
            <div className="flex-1 relative h-full">
              {rulerTicks}
            </div>
          </div>

          {/* Red Playhead Line */}
          <div 
            className="absolute top-0 bottom-0 pointer-events-none z-30 flex flex-col items-center"
            style={{ left: `${180 + timeToPixels(currentTime)}px` }}
          >
            <div className="w-3.5 h-3.5 bg-rose-500 rounded-b-md shadow-md -translate-y-1 shadow-rose-500/50" />
            <div className="w-0.5 flex-1 bg-rose-500 shadow-sm" />
          </div>

          {/* Track Rows */}
          {project.data.tracks.map((track) => {
            const isVideo = track.type === 'video';
            const isText = track.type === 'text';
            const isAudio = track.type === 'audio';

            return (
              <div 
                key={track.id}
                className="h-14 border-b border-studio-800/80 flex relative hover:bg-studio-850/40 transition-colors group"
              >
                {/* Track Left Header (Fixed sticky left) */}
                <div className="w-[180px] shrink-0 border-r border-studio-800 bg-studio-900/90 px-3 flex items-center justify-between sticky left-0 z-20 shadow-sm">
                  <div className="flex items-center gap-2 truncate">
                    {isVideo && <Film className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                    {isText && <Type className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    {isAudio && <Music className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    <span className="text-xs font-medium text-studio-200 truncate">{track.name}</span>
                  </div>

                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleTrackVisibility(track.id)}
                      className="p-1 rounded text-studio-400 hover:text-white"
                      title={track.hidden ? "Show track" : "Hide track"}
                    >
                      {track.hidden ? <EyeOff className="w-3 h-3 text-rose-400" /> : <Eye className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => toggleTrackMute(track.id)}
                      className="p-1 rounded text-studio-400 hover:text-white"
                      title={track.muted ? "Unmute track" : "Mute track"}
                    >
                      {track.muted ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Track Canvas & Clips Lane */}
                <div 
                  className="flex-1 relative h-full cursor-pointer"
                  onMouseDown={handleTimelineMouseDown}
                >
                  {track.clips.map((clip) => {
                    const isSelected = selectedClipId === clip.id;
                    const leftPx = timeToPixels(clip.startTime);
                    const widthPx = timeToPixels(clip.duration);

                    // Dynamic clip styling based on track type
                    let clipStyle = 'bg-blue-600/80 border-blue-400/50 text-blue-100';
                    if (isText) clipStyle = 'bg-amber-600/80 border-amber-400/50 text-amber-100';
                    if (isAudio) clipStyle = 'bg-emerald-600/80 border-emerald-400/50 text-emerald-100';

                    return (
                      <div
                        key={clip.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectClip(clip.id);
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          onSelectClip(clip.id);
                          setDraggingClip({
                            clipId: clip.id,
                            trackId: track.id,
                            startX: e.clientX,
                            initialStartTime: clip.startTime,
                            type: 'move',
                            initialDuration: clip.duration,
                            initialOffset: clip.startOffset || 0
                          });
                        }}
                        className={`absolute top-1.5 bottom-1.5 rounded-lg border flex items-center justify-between px-2 cursor-grab active:cursor-grabbing overflow-hidden shadow-md select-none transition-shadow ${clipStyle} ${
                          isSelected ? 'ring-2 ring-white ring-offset-1 ring-offset-studio-900 brightness-110 shadow-lg' : 'hover:brightness-105'
                        }`}
                        style={{
                          left: `${leftPx}px`,
                          width: `${Math.max(25, widthPx)}px`
                        }}
                      >
                        {/* Trim Left Handle */}
                        <div
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setDraggingClip({
                              clipId: clip.id,
                              trackId: track.id,
                              startX: e.clientX,
                              initialStartTime: clip.startTime,
                              type: 'trim-start',
                              initialDuration: clip.duration,
                              initialOffset: clip.startOffset || 0
                            });
                          }}
                          className="absolute left-0 top-0 bottom-0 w-2 hover:bg-white/40 cursor-ew-resize rounded-l"
                        />

                        {/* Clip Content Details */}
                        <div className="flex items-center gap-1.5 truncate px-1 pointer-events-none">
                          <span className="text-[11px] font-semibold truncate leading-tight">
                            {clip.text ? `"${clip.text}"` : clip.title}
                          </span>
                          <span className="text-[9px] opacity-75 font-mono">
                            {clip.duration.toFixed(1)}s
                          </span>
                        </div>

                        {/* Simulated audio waveform visual on audio clips */}
                        {isAudio && (
                          <div className="absolute inset-0 flex items-center justify-around opacity-25 pointer-events-none px-2">
                            {[40, 70, 30, 90, 60, 85, 45, 100, 50, 75, 35, 80].map((h, i) => (
                              <div key={i} className="w-1 bg-white rounded-full" style={{ height: `${h}%` }} />
                            ))}
                          </div>
                        )}

                        {/* Trim Right Handle */}
                        <div
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setDraggingClip({
                              clipId: clip.id,
                              trackId: track.id,
                              startX: e.clientX,
                              initialStartTime: clip.startTime,
                              type: 'trim-end',
                              initialDuration: clip.duration,
                              initialOffset: clip.startOffset || 0
                            });
                          }}
                          className="absolute right-0 top-0 bottom-0 w-2 hover:bg-white/40 cursor-ew-resize rounded-r"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
