import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Video, 
  Sliders, 
  Film, 
  Type, 
  Music, 
  Zap,
  LayoutTemplate
} from 'lucide-react';

interface HeroProps {
  onStartCreating: () => void;
  onExploreFeatures: () => void;
  onSelectTemplate: (templateId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartCreating,
  onExploreFeatures,
  onSelectTemplate
}) => {
  const [isPlayingDemo, setIsPlayingDemo] = useState(true);

  return (
    <section className="relative pt-12 pb-20 px-4 overflow-hidden">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-brand-violet/20 via-brand-cyan/20 to-brand-pink/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Top Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-studio-900 border border-studio-700/80 text-studio-300 text-xs font-medium mb-6 shadow-lg shadow-black/40 hover:border-brand-violet/50 transition-colors">
          <span className="flex h-2 w-2 rounded-full bg-brand-cyan animate-ping" />
          <span className="font-semibold text-white">VidCraft AI 2.0</span>
          <span className="text-studio-500">•</span>
          <span className="text-brand-cyan">100% Free Built-in AI Engines</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
          Your Complete{' '}
          <span className="bg-gradient-to-r from-brand-violet via-brand-cyan to-brand-pink bg-clip-text text-transparent">
            AI Video Studio
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-studio-300 max-w-2xl font-normal leading-relaxed mb-8">
          Create, edit, enhance and publish videos — all in one place.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-14">
          <button
            onClick={onStartCreating}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-violet to-brand-cyan hover:brightness-110 text-white font-bold text-sm shadow-xl shadow-brand-violet/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 group"
          >
            <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
            <span>Start Creating (Free)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={onExploreFeatures}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-studio-900 hover:bg-studio-800 text-white font-semibold text-sm border border-studio-700/80 hover:border-studio-600 transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Features</span>
          </button>
        </div>

        {/* Key USPs */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-studio-400 mb-14">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Zero installation required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No paid API keys needed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>4K Ultra-HD Export</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Multi-Track Timeline</span>
          </div>
        </div>

        {/* Visually Attractive Interactive Studio Preview Mockup */}
        <div className="w-full max-w-5xl rounded-3xl border border-studio-700/80 bg-studio-900/90 shadow-2xl overflow-hidden glass-panel-elevated relative group">
          {/* Top Mock Window Bar */}
          <div className="h-10 border-b border-studio-800 bg-studio-950/80 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-studio-400">VidCraft AI Studio — Cyberpunk Odyssey.mp4</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-brand-cyan font-mono">
              <span>16:9 • 1080p 60fps</span>
            </div>
          </div>

          {/* Main Mock Workspace */}
          <div className="grid grid-cols-12 h-[380px] sm:h-[460px] bg-studio-950">
            {/* Left Mock Drawer */}
            <div className="hidden md:flex col-span-3 border-r border-studio-800 bg-studio-900/60 p-3 flex-col gap-2.5 text-left">
              <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
                <span>AI Magic Studio</span>
              </div>
              <div className="p-2.5 rounded-xl bg-studio-800/80 border border-studio-700/60 text-xs">
                <div className="text-[10px] text-brand-cyan font-bold uppercase mb-1">Active AI Script</div>
                <p className="text-[11px] text-slate-300 italic">"Step into tomorrow. Create, disrupt, and lead with fearless ambition."</p>
              </div>
              <div className="p-2.5 rounded-xl bg-studio-800/80 border border-studio-700/60 text-xs">
                <div className="text-[10px] text-amber-400 font-bold uppercase mb-1">Color Grading</div>
                <p className="text-[11px] text-slate-300">Cinematic Teal & Orange (Active)</p>
              </div>
              <button 
                onClick={onStartCreating}
                className="mt-auto w-full py-2 rounded-xl bg-brand-violet hover:bg-brand-purple text-white text-xs font-bold shadow transition-colors flex items-center justify-center gap-1"
              >
                <span>Open in Studio</span>
              </button>
            </div>

            {/* Center Canvas Preview Area */}
            <div className="col-span-12 md:col-span-9 flex flex-col">
              <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
                  alt="Studio Preview"
                  className={`w-full h-full object-cover transition-transform duration-700 ${isPlayingDemo ? 'scale-105' : 'scale-100'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                {/* Subtitle Overlay in preview */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-xl bg-black/80 border border-white/20 text-white font-bold text-sm sm:text-base tracking-wide shadow-2xl flex items-center gap-2">
                  <span className="text-amber-400 font-black">FUTURE OF AI</span>
                  <span>IS HERE</span>
                </div>

                {/* Center Play Toggle */}
                <button
                  onClick={() => setIsPlayingDemo(!isPlayingDemo)}
                  className="w-14 h-14 rounded-full bg-studio-900/80 hover:bg-brand-violet text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl transition-all hover:scale-110"
                >
                  {isPlayingDemo ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white translate-x-0.5" />}
                </button>
              </div>

              {/* Bottom Mock Timeline */}
              <div className="h-28 border-t border-studio-800 bg-studio-900 p-2 flex flex-col gap-1.5">
                {/* Timeline tracks mock */}
                <div className="flex items-center gap-2 text-[10px] text-studio-400 px-2 font-mono">
                  <span>00:04.2 / 00:15.0</span>
                  <div className="flex-1 h-1 bg-studio-800 rounded-full overflow-hidden">
                    <div className="w-[30%] h-full bg-brand-cyan" />
                  </div>
                </div>

                {/* Track 1: Video */}
                <div className="h-6 rounded bg-blue-600/60 border border-blue-400/40 flex items-center px-2 text-[10px] font-bold text-white justify-between">
                  <span className="flex items-center gap-1.5"><Film className="w-3 h-3" /> Cyberpunk City Scene (8.0s)</span>
                  <span className="font-mono text-blue-200">1080p</span>
                </div>
                {/* Track 2: Text */}
                <div className="h-6 rounded bg-amber-600/60 border border-amber-400/40 flex items-center px-2 text-[10px] font-bold text-white justify-between">
                  <span className="flex items-center gap-1.5"><Type className="w-3 h-3" /> "FUTURE OF AI IS HERE"</span>
                  <span className="text-amber-200">Auto Subtitle</span>
                </div>
                {/* Track 3: Audio */}
                <div className="h-6 rounded bg-emerald-600/60 border border-emerald-400/40 flex items-center px-2 text-[10px] font-bold text-white justify-between">
                  <span className="flex items-center gap-1.5"><Music className="w-3 h-3" /> Cyber Pulse Synthwave Soundtrack</span>
                  <span className="text-emerald-200">120 BPM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
