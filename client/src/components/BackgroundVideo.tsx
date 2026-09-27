import React, { useState, useEffect } from 'react';
import { Camera, Sparkles, MapPin, Focus } from 'lucide-react';

interface CapturedPhoto {
  id: string;
  category: string;
  title: string;
  location: string;
  url: string;
  rotation: string;
}

// 8 curated photography subjects requested by the user
const CAPTURED_PHOTOS: CapturedPhoto[] = [
  {
    id: 'photo-cat',
    category: 'Pet & Cute',
    title: 'Golden Sunlight Cat',
    location: 'Garden Patio',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=700&q=80',
    rotation: '-rotate-1'
  },
  {
    id: 'photo-bird',
    category: 'Wildlife & Bird',
    title: 'Emerald Hummingbird',
    location: 'Cloud Forest',
    url: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=700&q=80',
    rotation: 'rotate-1'
  },
  {
    id: 'photo-flowers',
    category: 'Nature & Bloom',
    title: 'Wild Meadow Blossom',
    location: 'Spring Valley',
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=700&q=80',
    rotation: '-rotate-2'
  },
  {
    id: 'photo-mountain',
    category: 'Mountain Landscape',
    title: 'Alpine Ridge & Lake',
    location: 'Swiss Alps',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80',
    rotation: 'rotate-2'
  },
  {
    id: 'photo-sunset',
    category: 'Sunset & Sky',
    title: 'Golden Hour Horizon',
    location: 'Tranquil Bay',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80',
    rotation: '-rotate-1'
  },
  {
    id: 'photo-travel',
    category: 'Travel Location',
    title: 'Coastal Seaside Haven',
    location: 'Mediterranean Coast',
    url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=700&q=80',
    rotation: 'rotate-1'
  },
  {
    id: 'photo-building',
    category: 'Architecture',
    title: 'Modern Geometric Facade',
    location: 'Metropolis Center',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80',
    rotation: '-rotate-2'
  },
  {
    id: 'photo-ocean',
    category: 'Ocean & Waves',
    title: 'Turquoise Cresting Wave',
    location: 'Pacific Shoreline',
    url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=700&q=80',
    rotation: 'rotate-2'
  }
];

export const BackgroundVideo: React.FC = () => {
  // Photography sequence state
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [isFocusing, setIsFocusing] = useState<boolean>(false);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [cardVisible, setCardVisible] = useState<boolean>(true);
  const [shotNumber, setShotNumber] = useState<number>(1);

  // Pre-load photos into browser cache for instant transitions
  useEffect(() => {
    CAPTURED_PHOTOS.forEach(photo => {
      const img = new Image();
      img.src = photo.url;
    });
  }, []);

  // Continuous photography cycle:
  // 1. Photographer calmly observes scenery (camera locked on stationary tripod)
  // 2. Autofocus reticle briefly appears as she frames the subject
  // 3. Shutter click & subtle camera flash fires
  // 4. Old photo disappears -> New photo card smoothly appears beside her
  // 5. Only ONE photo card visible at any time
  useEffect(() => {
    const CYCLE_DURATION = 7500; // 7.5 seconds per shot

    const timer = setInterval(() => {
      // Step A: Focus lock at 5.4s
      setIsFocusing(true);

      setTimeout(() => {
        // Step B: Shutter click & camera flash at 6.2s
        setIsFocusing(false);
        setIsFlashing(true);
        setCardVisible(false); // smoothly retire previous photo

        setTimeout(() => {
          // Step C: Flash ends, switch to new photo at 6.45s
          setIsFlashing(false);
          setPhotoIndex(prev => (prev + 1) % CAPTURED_PHOTOS.length);
          setShotNumber(prev => prev + 1);
          setCardVisible(true); // new photo card smoothly reveals
        }, 250);

      }, 800);

    }, CYCLE_DURATION);

    return () => clearInterval(timer);
  }, []);

  const currentPhoto = CAPTURED_PHOTOS[photoIndex];

  return (
    <div 
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none bg-studio-950"
      aria-hidden="true"
    >
      {/* 
        FULL-VIEWPORT EDGE-TO-EDGE PHOTOGRAPHER BACKGROUND:
        - Covers 100% of the entire viewport: left, center, right, top, bottom
        - Locked camera perspective (NO zoom, NO shake, NO continuous scaling)
        - Preserves natural aspect ratio with object-cover and natural framing
      */}
      <img
        src="/assets/photographer-girl.jpg"
        alt="Photographer enjoying scenic photography across full viewport"
        className="w-full h-full object-cover object-[65%_25%] md:object-[62%_center] filter brightness-[0.93] contrast-[1.03] transition-all duration-700"
      />

      {/* 
        SUBTLE READABILITY OVERLAYS:
        - Very subtle dark/transparent overlays to make existing UI text & controls crisp
        - Keeps the photographer and scenery completely visible edge-to-edge
      */}
      <div className="absolute inset-0 bg-studio-950/45 backdrop-blur-[0.5px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-studio-950/75 via-studio-950/40 to-studio-950/15 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-studio-950/65 via-transparent to-studio-950/80 pointer-events-none" />

      {/* Gentle, natural floating flower petal particles in the mountain breeze */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-1/4 right-1/4 w-2 h-1.5 bg-sky-200/50 rounded-full blur-[0.5px] animate-pulse" />
        <span className="absolute top-1/3 right-1/3 w-2.5 h-2 bg-sky-300/40 rounded-full blur-[0.5px] animate-pulse" style={{ animationDelay: '1.2s' }} />
        <span className="absolute bottom-1/3 right-1/2 w-3 h-2 bg-sky-100/40 rounded-full blur-[0.5px] animate-pulse" style={{ animationDelay: '2.4s' }} />
        <span className="absolute top-1/2 left-1/3 w-2 h-1.5 bg-sky-200/30 rounded-full blur-[0.5px] animate-pulse" style={{ animationDelay: '1.8s' }} />
      </div>

      {/* Subtle Viewfinder / Autofocus Indicator at camera lens area */}
      {isFocusing && (
        <div 
          className="absolute top-[30%] right-[22%] sm:right-[25%] md:right-[28%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center gap-1 transition-opacity duration-300"
        >
          <div className="w-10 h-10 border-2 border-sky-300/90 rounded-sm flex items-center justify-center animate-ping">
            <Focus className="w-4 h-4 text-sky-200" />
          </div>
          <span className="px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono font-bold text-sky-300 uppercase tracking-widest">
            AF-L
          </span>
        </div>
      )}

      {/* Realistic Camera Shutter Flash (Gentle pulse originating from her camera lens) */}
      {isFlashing && (
        <>
          {/* Radial lens burst */}
          <div 
            className="absolute top-[30%] right-[22%] sm:right-[25%] md:right-[28%] -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
          >
            <div className="w-40 h-40 rounded-full bg-white blur-lg animate-ping opacity-95" />
            <div className="absolute inset-0 w-24 h-24 m-auto rounded-full bg-cyan-200 blur-md opacity-90" />
            <div className="absolute inset-0 w-10 h-10 m-auto rounded-full bg-white shadow-[0_0_40px_#ffffff]" />
          </div>

          {/* Gentle ambient scene flash pulse */}
          <div className="absolute inset-0 bg-white/15 backdrop-brightness-110 pointer-events-none z-20 transition-opacity duration-100" />
        </>
      )}

      {/* 
        CAPTURED PHOTO PREVIEW CARD:
        - Compact, elegant polaroid card (approx 20–25% screen width)
        - Positioned in open upper area beside the photographer
        - Strictly ONE captured photo visible at a time
        - CLICK → OLD PHOTO DISAPPEARS → NEW PHOTO APPEARS
      */}
      <div 
        className="absolute right-4 sm:right-10 md:right-16 top-20 sm:top-24 xl:right-28 xl:top-28 max-w-[210px] sm:max-w-[250px] pointer-events-none z-20 transition-all duration-400 ease-out"
        style={{
          transform: cardVisible ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(10px)',
          opacity: cardVisible ? 1 : 0
        }}
      >
        <div 
          className={`bg-white/95 p-2 sm:p-2.5 pb-3.5 sm:pb-4 rounded-xl shadow-[0_20px_45px_rgba(0,0,0,0.6)] border border-white/80 backdrop-blur-md transition-transform duration-500 ${currentPhoto.rotation}`}
        >
          {/* Photo Image Frame */}
          <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-slate-900 shadow-inner">
            <img
              src={currentPhoto.url}
              alt={currentPhoto.title}
              className="w-full h-full object-cover transition-transform duration-500"
            />

            {/* Shutter Watermark Badge */}
            <div className="absolute top-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[8px] font-semibold text-white">
              <Camera className="w-2.5 h-2.5 text-sky-300" />
              <span>Captured</span>
            </div>

            {/* Shot Counter */}
            <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/50 backdrop-blur-md text-[8px] font-mono text-white/80">
              #{String((photoIndex % 8) + 1).padStart(2, '0')}
            </div>
          </div>

          {/* Photo Caption Margin */}
          <div className="mt-2 px-0.5">
            <div className="flex items-center justify-between text-[9px] text-sky-800 font-semibold tracking-wider uppercase">
              <span className="flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-sky-600" />
                {currentPhoto.category}
              </span>
              <span className="text-slate-400 font-mono text-[8px]">
                0{((photoIndex % 8) + 1)}/08
              </span>
            </div>
            <h4 className="text-[11px] sm:text-xs font-bold text-slate-800 truncate mt-0.5">
              {currentPhoto.title}
            </h4>
            <div className="flex items-center gap-1 text-[9px] text-slate-500 mt-0.5 truncate">
              <MapPin className="w-2 h-2 text-slate-400 shrink-0" />
              <span className="truncate">{currentPhoto.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundVideo;
