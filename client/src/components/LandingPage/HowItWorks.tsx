import React from 'react';
import { 
  Upload, 
  Scissors, 
  Wand2, 
  Share2, 
  ArrowRight 
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Upload or Generate',
      description: 'Start from scratch, upload your own video footage and audio, or type an AI prompt to instantly generate a complete storyboard.',
      icon: Upload,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      step: '02',
      title: 'Edit with Powerful Tools',
      description: 'Trim clips, split at the playhead, rearrange multi-track layers, adjust playback speed, and fine-tune opacity with precision.',
      icon: Scissors,
      color: 'from-purple-500 to-indigo-600'
    },
    {
      step: '03',
      title: 'Add AI Features',
      description: 'Generate natural AI voiceovers, auto-sync viral word-by-word subtitles, animate still photos with Ken Burns, and apply cinematic color grades.',
      icon: Wand2,
      color: 'from-pink-500 to-rose-600'
    },
    {
      step: '04',
      title: 'Export and Share',
      description: 'Render your video at 60fps in 720p, 1080p, or 4K Ultra HD. Download directly to your device ready to publish on YouTube, TikTok, or Instagram.',
      icon: Share2,
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  return (
    <section className="py-20 px-4 bg-studio-900/40 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-cyan mb-2 block">
            Simple 4-Step Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            How VidCraft AI Works
          </h2>
          <p className="text-sm sm:text-base text-studio-400">
            From raw concept to published masterpiece in minutes — no prior video editing skills required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div 
                key={idx}
                className="relative rounded-2xl p-6 bg-studio-900 border border-studio-800 hover:border-studio-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${s.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-black text-studio-700 font-mono">
                      {s.step}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-studio-400 leading-relaxed">
                    {s.description}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-5 h-5 text-studio-700" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
