import { 
  PlaySquare, 
  Camera, 
  Smartphone, 
  Presentation, 
  GraduationCap, 
  Megaphone, 
  Flame 
} from 'lucide-react';

export const SupportedContent: React.FC = () => {
  const contentTypes = [
    {
      name: 'YouTube',
      desc: '16:9 landscape videos, intros, gaming, tech reviews & long-form tutorials',
      icon: PlaySquare,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    },
    {
      name: 'Instagram',
      desc: '1:1 square feeds, aesthetic motion carousels, and stories',
      icon: Camera,
      color: 'text-pink-500 bg-pink-500/10 border-pink-500/20'
    },
    {
      name: 'TikTok & Reels',
      desc: '9:16 vertical viral hooks with word-by-word karaoke subtitles',
      icon: Smartphone,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      name: 'YouTube Shorts',
      desc: 'Fast-paced under-60-second high-retention vertical shorts',
      icon: Flame,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    },
    {
      name: 'Advertisements',
      desc: 'High-converting e-commerce promo ads, product launch teasers',
      icon: Megaphone,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    {
      name: 'Presentations',
      desc: 'Corporate pitches, dynamic quarterly reports & investor decks',
      icon: Presentation,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      name: 'Education',
      desc: 'Online courses, explainer guides, school lectures & tutorials',
      icon: GraduationCap,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <section className="py-20 px-4 bg-studio-950 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-violet mb-2 block">
            Endless Possibilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Built for Every Channel & Content Type
          </h2>
          <p className="text-sm sm:text-base text-studio-400">
            Publish anywhere with optimal aspect ratios, resolutions, and tailored aesthetics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {contentTypes.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-2xl bg-studio-900 border border-studio-800 hover:border-studio-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-3 ${c.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{c.name}</h3>
                  <p className="text-xs text-studio-400 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
