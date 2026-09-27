import React from 'react';
import { 
  Wand2, 
  Film, 
  Volume2, 
  Type, 
  ImageIcon, 
  Sparkles, 
  LayoutTemplate, 
  Share2, 
  Download,
  ArrowRight,
  Zap,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface FeaturesSectionProps {
  onStartCreating: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onStartCreating }) => {
  const features = [
    {
      title: 'AI Video Generator',
      tagline: 'Text & Script to Video',
      description: 'Turn any idea or prompt into complete multi-scene video storyboards with narration, visual prompts, and subtitles in seconds.',
      icon: Wand2,
      gradient: 'from-purple-500 to-indigo-600',
      badge: 'Zero API Key Required'
    },
    {
      title: 'Professional Video Editor',
      tagline: 'Multi-Track Timeline',
      description: 'Full-featured timeline with trimming, splitting, speed ramp (0.25x-4x), opacity, layer reordering, and frame-accurate precision.',
      icon: Film,
      gradient: 'from-blue-500 to-cyan-500',
      badge: 'CapCut / Premiere Style'
    },
    {
      title: 'AI Voice-Over',
      tagline: 'Neural Text-to-Speech',
      description: 'Human-like voices across multiple accents and cadences. Control pitch, rate, and preview in real time without paid credits.',
      icon: Volume2,
      gradient: 'from-emerald-500 to-teal-500',
      badge: 'Instant Sync'
    },
    {
      title: 'Automatic Subtitles',
      tagline: 'Speech-to-Text & Karaoke Sync',
      description: 'Generate viral highlighted subtitles like TikTok, Shorts, and Netflix. Custom typography, animations, and background pills.',
      icon: Type,
      gradient: 'from-amber-500 to-orange-500',
      badge: 'Auto-Timed'
    },
    {
      title: 'Image-to-Video',
      tagline: 'Ken Burns & Fluid Motion',
      description: 'Transform still photographs and product renders into dynamic animated video clips with smooth pan, zoom, and parallax depth.',
      icon: ImageIcon,
      gradient: 'from-pink-500 to-rose-600',
      badge: 'Dynamic Camera'
    },
    {
      title: 'Video Enhancement',
      tagline: 'Cinema Color Grading',
      description: 'One-click Hollywood looks: Teal & Orange, Cyberpunk, 90s Vintage Film, Ultra HDR, and Noir Monochrome tone mapping.',
      icon: Sparkles,
      gradient: 'from-cyan-500 to-blue-600',
      badge: 'Hardware Accelerated'
    },
    {
      title: 'Ready-to-Use Templates',
      tagline: 'Instant Starters',
      description: 'Pre-designed high-converting templates for YouTube tech intros, TikTok hooks, product showcases, and inspirational quotes.',
      icon: LayoutTemplate,
      gradient: 'from-violet-500 to-pink-500',
      badge: '1-Click Launch'
    },
    {
      title: 'Social Media Creator',
      tagline: 'Multi-Aspect Switcher',
      description: 'Switch between 16:9 (YouTube), 9:16 (Shorts/TikTok/Reels), 1:1 (Instagram), and 4:5 with automatic canvas composition.',
      icon: Share2,
      gradient: 'from-fuchsia-500 to-rose-500',
      badge: 'All Formats'
    },
    {
      title: 'Import & Export',
      tagline: 'High Speed Rendering',
      description: 'Import MP4, WebM, MP3, PNG, and JPG. Export crisp 720p, 1080p, or 4K video directly to your desktop without watermarks.',
      icon: Download,
      gradient: 'from-teal-500 to-emerald-600',
      badge: 'No Watermarks'
    }
  ];

  return (
    <section id="features" className="py-20 px-4 bg-studio-950/60 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-violet/10 border border-brand-violet/30 text-brand-cyan text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Studio Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Everything You Need to Create Viral, High-Impact Videos
          </h2>
          <p className="text-base sm:text-lg text-studio-400">
            A complete studio packed with AI superpowers, precision timeline editing, and zero friction.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div 
                key={i}
                className="rounded-2xl p-6 bg-studio-900 border border-studio-800 hover:border-brand-violet/50 transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-brand-violet/10 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${f.gradient} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-studio-300 bg-studio-800 px-2 py-1 rounded-md border border-studio-700/60">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-brand-cyan transition-colors">
                    {f.title}
                  </h3>
                  <div className="text-xs font-semibold text-brand-violet mb-3">
                    {f.tagline}
                  </div>
                  <p className="text-xs text-studio-400 leading-relaxed">
                    {f.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-studio-800/80 flex items-center justify-between text-xs font-semibold text-studio-400 group-hover:text-white">
                  <span>Try in Editor</span>
                  <ArrowRight className="w-4 h-4 text-brand-cyan group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-brand-violet/20 via-studio-900 to-brand-cyan/20 border border-studio-700/80 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Ready to create your next video masterpiece?
            </h3>
            <p className="text-xs sm:text-sm text-studio-400">
              Launch the studio now. No credit card, no waiting list, completely free.
            </p>
          </div>
          <button
            onClick={onStartCreating}
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-violet to-brand-cyan hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-brand-violet/30 hover:scale-105 active:scale-95 transition-all shrink-0"
          >
            Launch VidCraft Studio
          </button>
        </div>
      </div>
    </section>
  );
};
