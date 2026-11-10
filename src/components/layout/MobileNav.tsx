import React from 'react';
import { Home, Mic2, Video, Compass, User } from 'lucide-react';
import { CategoryId, StreamerProfile } from '../../types';

interface MobileNavProps {
  activeCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  onOpenGoLive: () => void;
  onOpenProfile: (profile: StreamerProfile) => void;
  currentUser: StreamerProfile;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenGoLive,
  onOpenProfile,
  currentUser,
}) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#0a0814]/95 backdrop-blur-xl border-t border-purple-900/30 px-3 flex items-center justify-around">
      {/* Home */}
      <button
        onClick={() => onSelectCategory('all')}
        className={`flex flex-col items-center justify-center gap-1 transition-colors ${
          activeCategory === 'all' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Home</span>
      </button>

      {/* Audio Adda 8-Seat */}
      <button
        onClick={() => onSelectCategory('audio_adda')}
        className={`flex flex-col items-center justify-center gap-1 transition-colors ${
          activeCategory === 'audio_adda' ? 'text-fuchsia-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Mic2 className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Audio Adda</span>
      </button>

      {/* Center Go Live Pulse Button */}
      <button
        onClick={onOpenGoLive}
        className="-mt-5 relative group cursor-pointer focus:outline-none"
      >
        <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-pink-500 flex items-center justify-center shadow-lg shadow-fuchsia-600/40 p-0.5 transition-transform active:scale-95 group-hover:scale-105">
          <div className="w-full h-full rounded-full bg-[#0b0817] flex items-center justify-center group-hover:bg-transparent transition-colors">
            <Video className="w-6 h-6 text-white animate-pulse" />
          </div>
        </div>
        <span className="block text-center text-[9px] font-bold text-pink-300 mt-0.5 tracking-wide">
          GO LIVE
        </span>
      </button>

      {/* Explore / Gaming */}
      <button
        onClick={() => onSelectCategory('gaming')}
        className={`flex flex-col items-center justify-center gap-1 transition-colors ${
          activeCategory === 'gaming' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Gaming</span>
      </button>

      {/* User Profile */}
      <button
        onClick={() => onOpenProfile(currentUser)}
        className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
      >
        <div className="relative">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-5 h-5 rounded-full object-cover ring-1 ring-purple-500"
          />
        </div>
        <span className="text-[10px] font-semibold">Profile</span>
      </button>
    </nav>
  );
};
