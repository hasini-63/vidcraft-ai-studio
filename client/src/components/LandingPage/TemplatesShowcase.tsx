import { 
  Sparkles, 
} from 'lucide-react';

interface TemplatesShowcaseProps {
  onSelectTemplate: (templateId: string) => void;
}

export const TemplatesShowcase: React.FC<TemplatesShowcaseProps> = ({ onSelectTemplate }) => {
  const templates = [
    {
      id: 'template-tech-intro',
      title: 'Neon Cyberpunk YouTube Intro',
      description: 'High-octane intro for tech reviews, gaming, and code tutorials with glitch & neon titles.',
      category: 'YouTube 16:9',
      duration: '10.0s',
      aspectRatio: '16:9',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'template-reels-hook',
      title: 'Viral TikTok / Reels Hook',
      description: 'Dynamic 9:16 vertical hook with punchy word-by-word highlighted captions & trending beat.',
      category: 'Shorts & Reels 9:16',
      duration: '12.0s',
      aspectRatio: '9:16',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'template-product-promo',
      title: 'Minimalist Product Showcase',
      description: 'Clean, elegant 1:1 square video optimized for Instagram feeds and e-commerce ads.',
      category: 'Instagram 1:1',
      duration: '10.0s',
      aspectRatio: '1:1',
      thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'template-quote-motivation',
      title: 'Cinematic Wisdom & Quotes',
      description: 'Breathtaking nature visuals with slow zoom and profound quotes for mindfulness channels.',
      category: 'Motivation 16:9',
      duration: '12.0s',
      aspectRatio: '16:9',
      thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <section id="templates" className="py-20 px-4 bg-studio-900/60 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-cyan mb-2 block">
              Jumpstart Your Production
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Pre-Designed Creator Templates
            </h2>
            <p className="text-sm text-studio-400 mt-2">
              Ready-to-use timelines with motion graphics, audio tracks, and synchronized captions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="rounded-2xl bg-studio-900 border border-studio-800 hover:border-brand-violet/50 overflow-hidden shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-44 overflow-hidden bg-black">
                  <img
                    src={tpl.thumbnail}
                    alt={tpl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Aspect Ratio Badge */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-studio-300">
                    {tpl.aspectRatio}
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-white">
                    {tpl.duration}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4">
                  <span className="text-[10px] font-bold text-brand-cyan uppercase tracking-wider block mb-1">
                    {tpl.category}
                  </span>
                  <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-brand-violet transition-colors">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-studio-400 leading-relaxed line-clamp-2">
                    {tpl.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => onSelectTemplate(tpl.id)}
                  className="w-full py-2 rounded-xl bg-studio-800 hover:bg-brand-violet text-white text-xs font-semibold border border-studio-700 hover:border-transparent transition-all flex items-center justify-center gap-1.5 shadow"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Use This Template</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
