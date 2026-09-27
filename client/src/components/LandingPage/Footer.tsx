import React from 'react';
import { Video, Heart, Shield, Cpu, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-studio-800 bg-studio-950 py-12 px-4 text-studio-400 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-cyan flex items-center justify-center shadow-lg shadow-brand-violet/30">
              <Video className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base text-white">
              VidCraft <span className="text-brand-cyan">AI</span>
            </span>
          </div>
          <p className="text-xs text-studio-400 font-medium">
            Create. Edit. Enhance. Share.
          </p>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-studio-400 font-mono">
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Hardware Accelerated Canvas</span>
          </span>
          <span className="text-studio-700">•</span>
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero-Cost Built-in AI Engines</span>
          </span>
          <span className="text-studio-700">•</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-violet" />
            <span>4K Ultra-HD Export</span>
          </span>
        </div>

        {/* Copyright */}
        <div className="text-center md:text-right text-[11px] text-studio-400">
          © {new Date().getFullYear()} VidCraft AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
