import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { BackgroundVideo } from './components/BackgroundVideo';
import { VideoCanvas } from './components/Studio/VideoCanvas';
import { Timeline } from './components/Studio/Timeline';
import { LeftSidebar } from './components/Studio/LeftSidebar';
import { RightInspector } from './components/Studio/RightInspector';
import { ExportModal } from './components/Studio/ExportModal';
import { AIProviderModal } from './components/Studio/AIProviderModal';
import { AuthModal } from './components/AuthModal';

import { Hero } from './components/LandingPage/Hero';
import { FeaturesSection } from './components/LandingPage/FeaturesSection';
import { HowItWorks } from './components/LandingPage/HowItWorks';
import { SupportedContent } from './components/LandingPage/SupportedContent';
import { TemplatesShowcase } from './components/LandingPage/TemplatesShowcase';
import { Footer } from './components/LandingPage/Footer';

import { Project, Track, Clip, User } from './types';
import { api } from './services/api';

// Initial default starter project
const DEFAULT_INITIAL_PROJECT: Project = {
  id: 'project-default',
  title: 'Cyberpunk Odyssey - Tech Teaser',
  description: 'Futuristic AI video creation',
  aspectRatio: '16:9',
  duration: 11.0,
  fps: 30,
  resolution: '1080p',
  thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  data: {
    tracks: [
      {
        id: 'track-v1',
        name: 'Video Track 1',
        type: 'video',
        clips: [
          {
            id: 'clip-1',
            title: 'Cyberpunk Metropolis',
            type: 'video',
            url: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-traffic-in-time-lapse-42095-large.mp4',
            startTime: 0,
            duration: 5,
            startOffset: 0,
            volume: 1,
            opacity: 1,
            speed: 1,
            filters: {
              brightness: 105,
              contrast: 115,
              saturation: 125,
              hueRotate: 0,
              preset: 'cinematic-teal-orange'
            }
          },
          {
            id: 'clip-2',
            title: 'Digital Data Streams',
            type: 'video',
            url: 'https://assets.mixkit.co/videos/preview/mixkit-laser-lights-projected-on-smoke-41712-large.mp4',
            startTime: 5,
            duration: 6,
            startOffset: 0,
            volume: 1,
            opacity: 1,
            speed: 1,
            filters: {
              brightness: 110,
              contrast: 120,
              saturation: 130,
              hueRotate: 20,
              preset: 'cyberpunk-neon'
            }
          }
        ]
      },
      {
        id: 'track-t1',
        name: 'Captions & Titles',
        type: 'text',
        clips: [
          {
            id: 'text-1',
            title: 'FUTURE OF AI',
            type: 'text',
            text: 'FUTURE OF AI VIDEO',
            startTime: 0.5,
            duration: 4,
            fontSize: 44,
            fontColor: '#ffffff',
            fontFamily: 'Inter',
            fontWeight: 'bold',
            backgroundColor: 'rgba(0,0,0,0.7)',
            yPosition: 80,
            xPosition: 50,
            animation: 'fade'
          },
          {
            id: 'text-2',
            title: 'Create Without Limits',
            type: 'text',
            text: 'Create Without Limits',
            startTime: 5.5,
            duration: 5,
            fontSize: 40,
            fontColor: '#38bdf8',
            fontFamily: 'Inter',
            fontWeight: 'bold',
            backgroundColor: 'rgba(15,23,42,0.8)',
            yPosition: 80,
            xPosition: 50,
            animation: 'slide-up'
          }
        ]
      },
      {
        id: 'track-a1',
        name: 'Soundtrack & Voice',
        type: 'audio',
        clips: [
          {
            id: 'audio-1',
            title: 'Cyber Pulse Synthwave',
            type: 'audio',
            url: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
            startTime: 0,
            duration: 11,
            startOffset: 0,
            volume: 0.7
          }
        ]
      }
    ]
  }
};

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'editor'>('landing');
  const [project, setProject] = useState<Project>(DEFAULT_INITIAL_PROJECT);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Undo / Redo history stacks
  const [undoStack, setUndoStack] = useState<Project[]>([]);
  const [redoStack, setRedoStack] = useState<Project[]>([]);

  // Modals
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isAIProvidersOpen, setIsAIProvidersOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Auto-save debounce ref
  const saveTimeoutRef = useRef<any>(null);

  // Fetch initial profile & user project if available
  useEffect(() => {
    api.getCurrentUser().then(user => {
      if (user) setCurrentUser(user);
    });

    api.getProjects().then(projects => {
      if (projects.length > 0) {
        setProject(projects[0]);
      }
    });
  }, []);

  // Push project state to Undo stack
  const recordHistory = useCallback((currentProject: Project) => {
    setUndoStack(prev => [...prev.slice(-20), JSON.parse(JSON.stringify(currentProject))]);
    setRedoStack([]);
  }, []);

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, JSON.parse(JSON.stringify(project))]);
    setUndoStack(prev => prev.slice(0, prev.length - 1));
    setProject(previous);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(project))]);
    setRedoStack(prev => prev.slice(0, prev.length - 1));
    setProject(next);
  };

  // Update Project properties
  const handleUpdateProject = (updates: Partial<Project>) => {
    recordHistory(project);
    setProject(prev => {
      const updated = { ...prev, ...updates };
      triggerAutoSave(updated);
      return updated;
    });
  };

  // Update Tracks
  const handleUpdateTracks = (tracks: Track[]) => {
    recordHistory(project);
    setProject(prev => {
      const updated = {
        ...prev,
        data: {
          ...prev.data,
          tracks
        }
      };
      triggerAutoSave(updated);
      return updated;
    });
  };

  // Trigger Debounced Auto-Save
  const triggerAutoSave = (proj: Project) => {
    setIsSaving(true);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await api.saveProject(proj.id, proj);
      } catch (err) {
        console.warn('Auto-save locally persisted');
      } finally {
        setIsSaving(false);
      }
    }, 1500);
  };

  // Split selected clip at currentTime
  const handleSplitClip = () => {
    if (!selectedClipId) return;

    let targetTrack: Track | undefined;
    let targetClip: Clip | undefined;

    for (const t of project.data.tracks) {
      const c = t.clips.find(clip => clip.id === selectedClipId);
      if (c) {
        targetTrack = t;
        targetClip = c;
        break;
      }
    }

    if (!targetTrack || !targetClip) return;

    // Check if playhead is strictly inside the clip
    if (currentTime <= targetClip.startTime || currentTime >= (targetClip.startTime + targetClip.duration)) {
      return;
    }

    recordHistory(project);

    const firstDuration = Number((currentTime - targetClip.startTime).toFixed(2));
    const secondDuration = Number((targetClip.duration - firstDuration).toFixed(2));
    const secondOffset = Number(((targetClip.startOffset || 0) + firstDuration * (targetClip.speed || 1)).toFixed(2));

    const firstClip: Clip = {
      ...targetClip,
      duration: firstDuration
    };

    const secondClip: Clip = {
      ...targetClip,
      id: `clip-${Date.now().toString(36)}-split`,
      title: `${targetClip.title} (Part 2)`,
      startTime: Number(currentTime.toFixed(2)),
      duration: secondDuration,
      startOffset: secondOffset
    };

    const updatedTracks = project.data.tracks.map(t => {
      if (t.id !== targetTrack!.id) return t;
      return {
        ...t,
        clips: t.clips.flatMap(c => (c.id === targetClip!.id ? [firstClip, secondClip] : [c]))
      };
    });

    handleUpdateTracks(updatedTracks);
    setSelectedClipId(secondClip.id);
  };

  // Duplicate selected clip
  const handleDuplicateClip = () => {
    if (!selectedClipId) return;

    let targetTrack: Track | undefined;
    let targetClip: Clip | undefined;

    for (const t of project.data.tracks) {
      const c = t.clips.find(clip => clip.id === selectedClipId);
      if (c) {
        targetTrack = t;
        targetClip = c;
        break;
      }
    }

    if (!targetTrack || !targetClip) return;

    recordHistory(project);

    const duplicatedClip: Clip = {
      ...targetClip,
      id: `clip-${Date.now().toString(36)}-copy`,
      title: `${targetClip.title} (Copy)`,
      startTime: Number((targetClip.startTime + targetClip.duration + 0.2).toFixed(2))
    };

    const updatedTracks = project.data.tracks.map(t => {
      if (t.id !== targetTrack!.id) return t;
      return {
        ...t,
        clips: [...t.clips, duplicatedClip]
      };
    });

    handleUpdateTracks(updatedTracks);
    setSelectedClipId(duplicatedClip.id);
  };

  // Delete selected clip
  const handleDeleteClip = () => {
    if (!selectedClipId) return;
    recordHistory(project);

    const updatedTracks = project.data.tracks.map(t => ({
      ...t,
      clips: t.clips.filter(c => c.id !== selectedClipId)
    }));

    handleUpdateTracks(updatedTracks);
    setSelectedClipId(null);
  };

  // Update specific selected clip
  const handleUpdateClip = (clipId: string, updates: Partial<Clip>) => {
    const updatedTracks = project.data.tracks.map(t => ({
      ...t,
      clips: t.clips.map(c => (c.id === clipId ? { ...c, ...updates } : c))
    }));
    handleUpdateTracks(updatedTracks);
  };

  // Create new blank project
  const handleNewProject = async () => {
    try {
      const newProj = await api.createProject({
        title: 'New Creative Video',
        aspectRatio: '16:9',
        duration: 15.0
      });
      setProject(newProj);
      setCurrentTime(0);
      setSelectedClipId(null);
      setCurrentView('editor');
    } catch {
      // Fallback
      setProject({
        id: `project-${Date.now()}`,
        title: 'New Creative Video',
        aspectRatio: '16:9',
        duration: 15.0,
        fps: 30,
        resolution: '1080p',
        data: {
          tracks: [
            { id: 'v1', name: 'Video Track 1', type: 'video', clips: [] },
            { id: 't1', name: 'Text Track 1', type: 'text', clips: [] },
            { id: 'a1', name: 'Audio Track 1', type: 'audio', clips: [] }
          ]
        }
      });
      setCurrentTime(0);
      setSelectedClipId(null);
      setCurrentView('editor');
    }
  };

  // Select starter template
  const handleSelectTemplate = async (templateId: string) => {
    try {
      const res = await api.getProject(templateId);
      if (res) {
        setProject(res);
        setCurrentTime(0);
        setSelectedClipId(null);
        setCurrentView('editor');
        return;
      }
    } catch {}

    // Fallback template
    setProject(DEFAULT_INITIAL_PROJECT);
    setCurrentTime(0);
    setCurrentView('editor');
  };

  // Find currently selected clip and its track
  let selectedClip: Clip | null = null;
  let selectedTrack: Track | null = null;
  if (selectedClipId) {
    for (const t of project.data.tracks) {
      const c = t.clips.find(clip => clip.id === selectedClipId);
      if (c) {
        selectedClip = c;
        selectedTrack = t;
        break;
      }
    }
  }

  // Keyboard Shortcuts (Space: Play/Pause, S: Split, Delete: Delete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      } else if (e.code === 'KeyS' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleSplitClip();
      } else if (e.code === 'Delete' || e.code === 'Backspace') {
        e.preventDefault();
        handleDeleteClip();
      } else if (e.code === 'KeyZ' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if (e.code === 'KeyY' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleRedo();
      } else if (e.code === 'Escape') {
        setSelectedClipId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedClipId, currentTime, project]);

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col overflow-hidden relative">
      {/* Background Animated Character Video */}
      <BackgroundVideo />

      {/* Top Navbar */}
      <Navbar
        project={project}
        onUpdateProject={handleUpdateProject}
        onNewProject={handleNewProject}
        onOpenTemplates={() => {
          setCurrentView('landing');
          setTimeout(() => {
            document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenAIProviders={() => setIsAIProvidersOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onToggleView={(view) => setCurrentView(view)}
        currentView={currentView}
        currentUser={currentUser}
        onLogout={() => {
          api.logout();
          setCurrentUser(null);
        }}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        isSaving={isSaving}
      />

      {/* Main View Router */}
      {currentView === 'landing' ? (
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <Hero
            onStartCreating={() => setCurrentView('editor')}
            onExploreFeatures={() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}
            onSelectTemplate={handleSelectTemplate}
          />
          <FeaturesSection onStartCreating={() => setCurrentView('editor')} />
          <HowItWorks />
          <SupportedContent />
          <TemplatesShowcase onSelectTemplate={handleSelectTemplate} />
          <Footer />
        </main>
      ) : (
        /* Video Studio Editor */
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar Tools */}
            <LeftSidebar
              project={project}
              onUpdateTracks={handleUpdateTracks}
              onUpdateProjectDuration={(dur) => handleUpdateProject({ duration: dur })}
              currentTime={currentTime}
            />

            {/* Canvas Video Player Area */}
            <VideoCanvas
              project={project}
              currentTime={currentTime}
              isPlaying={isPlaying}
              onTimeUpdate={(time) => setCurrentTime(time)}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              selectedClipId={selectedClipId}
              onSelectClip={(id) => setSelectedClipId(id)}
            />

            {/* Right Inspector */}
            <RightInspector
              selectedClip={selectedClip}
              selectedTrack={selectedTrack}
              onUpdateClip={handleUpdateClip}
              onDeleteClip={handleDeleteClip}
              onDuplicateClip={handleDuplicateClip}
              onClose={() => setSelectedClipId(null)}
            />
          </div>

          {/* Bottom Multi-Track Timeline */}
          <Timeline
            project={project}
            currentTime={currentTime}
            onTimeUpdate={(time) => setCurrentTime(time)}
            selectedClipId={selectedClipId}
            onSelectClip={(id) => setSelectedClipId(id)}
            onUpdateTracks={handleUpdateTracks}
            onSplitClip={handleSplitClip}
            onDeleteClip={handleDeleteClip}
            onDuplicateClip={handleDuplicateClip}
          />
        </main>
      )}

      {/* Modals */}
      <ExportModal
        project={project}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <AIProviderModal
        isOpen={isAIProvidersOpen}
        onClose={() => setIsAIProvidersOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => setCurrentUser(user)}
      />
    </div>
  );
};

export default App;
