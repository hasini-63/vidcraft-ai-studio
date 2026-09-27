import React from 'react';
import { 
  Video, 
  Sparkles, 
  Download, 
  Undo2, 
  Redo2, 
  FolderPlus, 
  LayoutTemplate, 
  Monitor, 
  Smartphone, 
  Square, 
  CheckCircle2, 
  Sliders, 
  User as UserIcon,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { AspectRatio, Project, User } from '../types';

interface NavbarProps {
  project: Project;
  onUpdateProject: (updates: Partial<Project>) => void;
  onNewProject: () => void;
  onOpenTemplates: () => void;
  onOpenExport: () => void;
  onOpenAIProviders: () => void;
  onOpenAuth: () => void;
  onToggleView: (view: 'editor' | 'landing') => void;
  currentView: 'editor' | 'landing';
  currentUser: User | null;
  onLogout: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  isSaving?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  project,
  onUpdateProject,
  onNewProject,
  onOpenTemplates,
  onOpenExport,
  onOpenAIProviders,
  onOpenAuth,
  onToggleView,
  currentView,
  currentUser,
  onLogout,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  isSaving = false
}) => {
  const [aspectDropdownOpen, setAspectDropdownOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  const aspectRatios: Array<{ ratio: AspectRatio; label: string; icon: any; desc: string }> = [
    { ratio: '16:9', label: '16:9 Landscape', icon: Monitor, desc: 'YouTube, Web, Desktop' },
    { ratio: '9:16', label: '9:16 Vertical', icon: Smartphone, desc: 'TikTok, Reels, Shorts' },
    { ratio: '1:1', label: '1:1 Square', icon: Square, desc: 'Instagram Feed' },
    { ratio: '4:5', label: '4:5 Portrait', icon: Smartphone, desc: 'Facebook, Social Ads' },
    { ratio: '21:9', label: '21:9 Ultrawide', icon: Monitor, desc: 'Cinematic Widescreen' }
  ];

  return (
    <header className="h-14 border-b border-studio-800 bg-studio-900/90 backdrop-blur-md px-4 flex items-center justify-between z-30 select-none">
      {/* Brand & Mode switch */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onToggleView(currentView === 'editor' ? 'landing' : 'editor')}
          className="flex items-center gap-2 group focus:outline-none"
          title="Toggle Landing / Studio"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-cyan flex items-center justify-center shadow-lg shadow-brand-violet/30 group-hover:scale-105 transition-transform">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1">
                VidCraft <span className="bg-gradient-to-r from-brand-violet via-brand-cyan to-brand-pink bg-clip-text text-transparent">AI</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-brand-violet/20 text-brand-cyan border border-brand-violet/40">
                Studio
              </span>
            </div>
          </div>
        </button>

        {currentView === 'editor' && (
          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-studio-800">
            <button
              onClick={() => onToggleView('landing')}
              className="text-xs text-studio-400 hover:text-white px-2 py-1 rounded hover:bg-studio-800 transition-colors"
            >
              Overview
            </button>
            <button
              onClick={onNewProject}
              className="flex items-center gap-1.5 text-xs text-studio-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-studio-800 transition-colors"
              title="New Blank Project"
            >
              <FolderPlus className="w-3.5 h-3.5 text-brand-cyan" />
              <span>New</span>
            </button>
            <button
              onClick={onOpenTemplates}
              className="flex items-center gap-1.5 text-xs text-studio-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-studio-800 transition-colors"
              title="Browse Templates"
            >
              <LayoutTemplate className="w-3.5 h-3.5 text-brand-purple" />
              <span>Templates</span>
            </button>
          </div>
        )}
      </div>

      {/* Center: Project Title, Aspect Ratio & Undo/Redo */}
      {currentView === 'editor' && (
        <div className="flex items-center gap-3">
          {/* Editable Title */}
          <div className="flex items-center gap-2 max-w-[220px] md:max-w-xs">
            <input
              type="text"
              value={project.title}
              onChange={(e) => onUpdateProject({ title: e.target.value })}
              className="bg-transparent hover:bg-studio-800/60 focus:bg-studio-800 text-sm font-medium text-slate-200 px-2 py-1 rounded border border-transparent focus:border-brand-violet/50 outline-none transition-all truncate"
              title="Click to rename project"
            />
            {isSaving ? (
              <span className="text-[10px] text-studio-400 italic shrink-0">Saving...</span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium shrink-0">
                <CheckCircle2 className="w-3 h-3" />
                <span className="hidden sm:inline">Saved</span>
              </span>
            )}
          </div>

          {/* Aspect Ratio Selector */}
          <div className="relative">
            <button
              onClick={() => setAspectDropdownOpen(!aspectDropdownOpen)}
              className="flex items-center gap-1.5 bg-studio-800 hover:bg-studio-700/80 text-studio-200 text-xs px-2.5 py-1.5 rounded-lg border border-studio-700 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5 text-brand-cyan" />
              <span>{project.aspectRatio}</span>
              <ChevronDown className="w-3 h-3 text-studio-400" />
            </button>

            {aspectDropdownOpen && (
              <div 
                className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-52 glass-dropdown rounded-xl p-1.5 z-50 border border-studio-700 shadow-2xl"
                onMouseLeave={() => setAspectDropdownOpen(false)}
              >
                <div className="text-[10px] uppercase font-bold text-studio-400 px-2 py-1 tracking-wider">
                  Aspect Ratio
                </div>
                {aspectRatios.map((ar) => {
                  const Icon = ar.icon;
                  return (
                    <button
                      key={ar.ratio}
                      onClick={() => {
                        onUpdateProject({ aspectRatio: ar.ratio });
                        setAspectDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left text-xs transition-colors ${
                        project.aspectRatio === ar.ratio
                          ? 'bg-brand-violet/20 text-brand-cyan font-medium border border-brand-violet/30'
                          : 'text-studio-300 hover:bg-studio-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-studio-400" />
                      <div>
                        <div className="font-semibold">{ar.label}</div>
                        <div className="text-[10px] text-studio-400">{ar.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Undo / Redo */}
          <div className="hidden lg:flex items-center gap-1 bg-studio-800/80 p-0.5 rounded-lg border border-studio-700/60">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-1 rounded text-studio-300 hover:text-white disabled:opacity-30 disabled:hover:text-studio-300 transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-1 rounded text-studio-300 hover:text-white disabled:opacity-30 disabled:hover:text-studio-300 transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Right: AI Engine Status, User & Export Button */}
      <div className="flex items-center gap-2.5">
        {/* AI Engine Status Button */}
        <button
          onClick={onOpenAIProviders}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs transition-colors"
          title="VidCraft Open AI Engine Status"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-medium">Free AI Ready</span>
        </button>

        {/* User Account Button */}
        <div className="relative">
          {currentUser ? (
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-studio-800 transition-colors"
            >
              <img
                src={currentUser.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${currentUser.name}`}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full border border-studio-700 object-cover"
              />
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 text-xs text-studio-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-studio-800 hover:bg-studio-700 border border-studio-700 transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {userDropdownOpen && currentUser && (
            <div 
              className="absolute right-0 top-full mt-2 w-48 glass-dropdown rounded-xl p-2 z-50 border border-studio-700 shadow-2xl"
              onMouseLeave={() => setUserDropdownOpen(false)}
            >
              <div className="px-2 py-1.5 border-b border-studio-800">
                <div className="font-semibold text-xs text-white truncate">{currentUser.name}</div>
                <div className="text-[10px] text-studio-400 truncate">{currentUser.email}</div>
              </div>
              <button
                onClick={() => {
                  onOpenAIProviders();
                  setUserDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-studio-300 hover:text-white hover:bg-studio-800 rounded-lg mt-1 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>AI Providers</span>
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setUserDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg mt-1 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>

        {/* View switcher if on landing page */}
        {currentView === 'landing' ? (
          <button
            onClick={() => onToggleView('editor')}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-brand-violet to-brand-cyan hover:brightness-110 text-white font-medium text-xs shadow-lg shadow-brand-violet/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Open Studio</span>
          </button>
        ) : (
          /* Export Button */
          <button
            onClick={onOpenExport}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-violet to-brand-cyan hover:brightness-110 text-white font-medium text-xs shadow-lg shadow-brand-violet/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        )}
      </div>
    </header>
  );
};
