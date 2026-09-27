import React from 'react';
import { 
  Sliders, 
  Trash2, 
  Copy, 
  Type, 
  Film, 
  Music, 
  Sun, 
  Contrast, 
  Move, 
  Layers, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { Clip, Track } from '../../types';

interface RightInspectorProps {
  selectedClip: Clip | null;
  selectedTrack: Track | null;
  onUpdateClip: (clipId: string, updates: Partial<Clip>) => void;
  onDeleteClip: () => void;
  onDuplicateClip: () => void;
  onClose: () => void;
}

export const RightInspector: React.FC<RightInspectorProps> = ({
  selectedClip,
  selectedTrack,
  onUpdateClip,
  onDeleteClip,
  onDuplicateClip,
  onClose
}) => {
  if (!selectedClip) {
    return (
      <div className="w-72 border-l border-studio-800 bg-studio-900/90 backdrop-blur-md p-4 hidden xl:flex flex-col items-center justify-center text-center select-none text-studio-500">
        <Sliders className="w-8 h-8 mb-2 opacity-40 text-studio-400" />
        <p className="text-xs font-medium text-studio-400">No Clip Selected</p>
        <p className="text-[11px] text-studio-500 mt-1 max-w-[180px]">
          Click any clip on the timeline to edit properties, animations, and color filters.
        </p>
      </div>
    );
  }

  const isVideo = selectedClip.type === 'video' || selectedClip.type === 'image';
  const isText = selectedClip.type === 'text';
  const isAudio = selectedClip.type === 'audio';
  const filters = selectedClip.filters || { brightness: 100, contrast: 100, saturation: 100, hueRotate: 0 };

  const updateFilters = (key: string, value: number) => {
    onUpdateClip(selectedClip.id, {
      filters: {
        ...filters,
        [key]: value
      }
    });
  };

  return (
    <div className="w-80 border-l border-studio-800 bg-studio-900/95 backdrop-blur-md flex flex-col z-20 select-none overflow-y-auto custom-scrollbar p-4 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-studio-800 pb-3">
        <div className="flex items-center gap-2 truncate">
          {isVideo && <Film className="w-4 h-4 text-blue-400" />}
          {isText && <Type className="w-4 h-4 text-amber-400" />}
          {isAudio && <Music className="w-4 h-4 text-emerald-400" />}
          <span className="text-xs font-bold text-white truncate">
            {selectedClip.title || 'Clip Inspector'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onDuplicateClip}
            className="p-1.5 rounded-lg hover:bg-studio-800 text-studio-400 hover:text-white transition-colors"
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDeleteClip}
            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* General Properties (Start Time, Duration, Speed) */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase font-bold text-studio-400 tracking-wider">
          Timing & Speed
        </span>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-studio-400 block mb-1">Start Time (s)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={selectedClip.startTime}
              onChange={(e) => onUpdateClip(selectedClip.id, { startTime: Math.max(0, parseFloat(e.target.value) || 0) })}
              className="w-full bg-studio-800 border border-studio-700 text-xs text-white rounded-lg p-1.5 outline-none font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] text-studio-400 block mb-1">Duration (s)</label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              value={selectedClip.duration}
              onChange={(e) => onUpdateClip(selectedClip.id, { duration: Math.max(0.5, parseFloat(e.target.value) || 0.5) })}
              className="w-full bg-studio-800 border border-studio-700 text-xs text-white rounded-lg p-1.5 outline-none font-mono"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-studio-400 mb-1">
            <span>Playback Speed</span>
            <span className="font-mono text-brand-cyan">{selectedClip.speed || 1}x</span>
          </div>
          <input
            type="range"
            min="0.25"
            max="3"
            step="0.25"
            value={selectedClip.speed || 1}
            onChange={(e) => onUpdateClip(selectedClip.id, { speed: parseFloat(e.target.value) })}
            className="w-full accent-brand-cyan h-1 bg-studio-700 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Text & Captions Inspector */}
      {isText && (
        <div className="space-y-3 border-t border-studio-800 pt-3">
          <span className="text-[10px] uppercase font-bold text-studio-400 tracking-wider">
            Typography & Style
          </span>

          <div>
            <label className="text-[11px] text-studio-400 block mb-1">Text Content</label>
            <textarea
              rows={2}
              value={selectedClip.text || ''}
              onChange={(e) => onUpdateClip(selectedClip.id, { text: e.target.value })}
              className="w-full bg-studio-800 border border-studio-700 text-xs text-white rounded-lg p-2 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-studio-400 block mb-1">Font Size: {selectedClip.fontSize || 42}px</label>
              <input
                type="range"
                min="20"
                max="80"
                value={selectedClip.fontSize || 42}
                onChange={(e) => onUpdateClip(selectedClip.id, { fontSize: parseInt(e.target.value) })}
                className="w-full accent-brand-violet h-1 bg-studio-700 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="text-[11px] text-studio-400 block mb-1">Animation</label>
              <select
                value={selectedClip.animation || 'none'}
                onChange={(e) => onUpdateClip(selectedClip.id, { animation: e.target.value as any })}
                className="w-full bg-studio-800 border border-studio-700 text-xs text-white rounded-lg p-1.5 outline-none"
              >
                <option value="none">None</option>
                <option value="fade">Smooth Fade</option>
                <option value="slide-up">Slide Up</option>
                <option value="zoom">Pop Zoom</option>
                <option value="bounce">Bouncy Hook</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-studio-400 block mb-1">Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedClip.fontColor || '#ffffff'}
                  onChange={(e) => onUpdateClip(selectedClip.id, { fontColor: e.target.value })}
                  className="w-7 h-7 rounded border border-studio-700 bg-transparent cursor-pointer"
                />
                <span className="text-xs font-mono text-studio-300">{selectedClip.fontColor || '#ffffff'}</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-studio-400 block mb-1">Background</label>
              <select
                value={selectedClip.backgroundColor || 'transparent'}
                onChange={(e) => onUpdateClip(selectedClip.id, { backgroundColor: e.target.value })}
                className="w-full bg-studio-800 border border-studio-700 text-xs text-white rounded-lg p-1.5 outline-none"
              >
                <option value="transparent">None</option>
                <option value="rgba(0,0,0,0.75)">Black Pill</option>
                <option value="rgba(15,23,42,0.85)">Dark Slate</option>
                <option value="rgba(124,58,237,0.8)">Neon Violet</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Visual Filters (Brightness, Contrast, Saturation, Hue) */}
      {isVideo && (
        <div className="space-y-3 border-t border-studio-800 pt-3">
          <span className="text-[10px] uppercase font-bold text-studio-400 tracking-wider">
            Color Grading & Filters
          </span>

          <div>
            <div className="flex justify-between text-[11px] text-studio-400 mb-1">
              <span>Brightness</span>
              <span className="font-mono text-brand-cyan">{filters.brightness}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={filters.brightness}
              onChange={(e) => updateFilters('brightness', parseInt(e.target.value))}
              className="w-full accent-brand-cyan h-1 bg-studio-700 rounded cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-studio-400 mb-1">
              <span>Contrast</span>
              <span className="font-mono text-brand-cyan">{filters.contrast}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="160"
              value={filters.contrast}
              onChange={(e) => updateFilters('contrast', parseInt(e.target.value))}
              className="w-full accent-brand-cyan h-1 bg-studio-700 rounded cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-studio-400 mb-1">
              <span>Saturation</span>
              <span className="font-mono text-brand-cyan">{filters.saturation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={filters.saturation}
              onChange={(e) => updateFilters('saturation', parseInt(e.target.value))}
              className="w-full accent-brand-cyan h-1 bg-studio-700 rounded cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-studio-400 mb-1">
              <span>Hue Shift</span>
              <span className="font-mono text-brand-cyan">{filters.hueRotate}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={filters.hueRotate}
              onChange={(e) => updateFilters('hueRotate', parseInt(e.target.value))}
              className="w-full accent-brand-cyan h-1 bg-studio-700 rounded cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-studio-400 mb-1">
              <span>Opacity</span>
              <span className="font-mono text-brand-cyan">{Math.round((selectedClip.opacity ?? 1) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={selectedClip.opacity ?? 1}
              onChange={(e) => onUpdateClip(selectedClip.id, { opacity: parseFloat(e.target.value) })}
              className="w-full accent-brand-violet h-1 bg-studio-700 rounded cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Audio Properties */}
      {isAudio && (
        <div className="space-y-3 border-t border-studio-800 pt-3">
          <span className="text-[10px] uppercase font-bold text-studio-400 tracking-wider">
            Audio Levels
          </span>

          <div>
            <div className="flex justify-between text-[11px] text-studio-400 mb-1">
              <span>Track Volume</span>
              <span className="font-mono text-emerald-400">{Math.round((selectedClip.volume ?? 1) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={selectedClip.volume ?? 1}
              onChange={(e) => onUpdateClip(selectedClip.id, { volume: parseFloat(e.target.value) })}
              className="w-full accent-emerald-400 h-1 bg-studio-700 rounded cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
