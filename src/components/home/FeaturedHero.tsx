import React, { useState } from 'react';
import { 
  Play, 
  Users, 
  Heart, 
  Mic, 
  Radio, 
  Sparkles, 
  ShieldCheck, 
  Volume2, 
  ChevronRight,
  Flame,
  Share2
} from 'lucide-react';
import { LiveRoom, StreamerProfile } from '../../types';

interface FeaturedHeroProps {
  featuredRooms: LiveRoom[];
  onOpenRoom: (room: LiveRoom) => void;
  onOpenProfile: (profile: StreamerProfile) => void;
}

export const FeaturedHero: React.FC<FeaturedHeroProps> = ({
  featuredRooms,
  onOpenRoom,
  onOpenProfile,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!featuredRooms || featuredRooms.length === 0) return null;

  const currentRoom = featuredRooms[currentIndex] || featuredRooms[0];
  const isAudioAdda = currentRoom.type === 'audio';

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-purple-800/30 bg-[#0e0b1c] shadow-2xl mb-8 group">
      {/* Background Cover Image with Gradient Masks */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentRoom.coverImage}
          alt={currentRoom.title}
          className="w-full h-full object-cover object-center filter blur-xs brightness-40 scale-105 transition-transform duration-700 group-hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07070d] via-[#07070d]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070d] via-transparent to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 p-5 sm:p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-4">
          {/* Badges Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/90 text-white text-xs font-bold shadow-md shadow-rose-600/30 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white" />
              FEATURED LIVE
            </span>

            {isAudioAdda ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs font-semibold">
                <Mic className="w-3.5 h-3.5 text-cyan-400" />
                8-Seat Voice Adda
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-200 text-xs font-semibold">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                Video Broadcast
              </span>
            )}

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 text-slate-300 text-xs font-medium border border-slate-700/50">
              <Users className="w-3.5 h-3.5 text-rose-400" />
              {currentRoom.viewersCount.toLocaleString()} watching
            </span>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
            {currentRoom.title}
          </h1>

          {/* Host Info */}
          <div className="flex items-center gap-3.5 pt-1">
            <button
              onClick={() => onOpenProfile(currentRoom.host)}
              className="flex items-center gap-2.5 group/host cursor-pointer"
            >
              <div className="relative">
                <img
                  src={currentRoom.host.avatar}
                  alt={currentRoom.host.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-500/80 group-hover/host:ring-cyan-400 transition-all shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 px-1 rounded-full bg-purple-600 text-[9px] font-bold text-white border border-black">
                  Lv.{currentRoom.host.level}
                </span>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-sm font-bold text-white group-hover/host:text-cyan-300 transition-colors">
                  <span>{currentRoom.host.name}</span>
                  {currentRoom.host.isVerified && (
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
                <div className="text-xs text-purple-300/80 font-medium">
                  @{currentRoom.host.username} • {currentRoom.host.followersCount.toLocaleString()} fans
                </div>
              </div>
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {currentRoom.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900/60 border border-purple-900/30 text-purple-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onOpenRoom(currentRoom)}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-fuchsia-600/30 hover:shadow-cyan-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isAudioAdda ? 'Join Voice Adda' : 'Watch Live Stream'}</span>
            </button>

            <button
              onClick={() => onOpenProfile(currentRoom.host)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 text-sm font-semibold transition-colors cursor-pointer"
            >
              <Heart className="w-4 h-4 text-pink-400" />
              <span>{currentRoom.likesCount.toLocaleString()}</span>
            </button>
          </div>
        </div>

        {/* Live Audio Spectrum / Video Preview Card */}
        <div className="w-full md:w-80 lg:w-96 rounded-2xl overflow-hidden bg-slate-950/70 border border-purple-500/30 p-4 shrink-0 shadow-2xl relative">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
            <img
              src={currentRoom.coverImage}
              alt={currentRoom.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-900/80 text-purple-200 border border-purple-500/40 flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-cyan-400 animate-pulse" /> Live Preview
                </span>
                <span className="text-[10px] text-slate-300 font-medium">
                  {currentRoom.startedAt}
                </span>
              </div>

              {/* Animated Equalizer Wave Bars */}
              <div className="flex items-end justify-center gap-1.5 h-8">
                <span className="w-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0ms] h-4" />
                <span className="w-1 bg-pink-500 rounded-full animate-bounce [animation-delay:150ms] h-7" />
                <span className="w-1 bg-violet-400 rounded-full animate-bounce [animation-delay:300ms] h-6" />
                <span className="w-1 bg-cyan-300 rounded-full animate-bounce [animation-delay:75ms] h-8" />
                <span className="w-1 bg-fuchsia-400 rounded-full animate-bounce [animation-delay:225ms] h-5" />
                <span className="w-1 bg-purple-400 rounded-full animate-bounce [animation-delay:120ms] h-7" />
              </div>

              {/* Audio Adda Guest Seat Visualizer snippet */}
              {isAudioAdda && (
                <div className="text-center bg-black/60 backdrop-blur-xs rounded-lg py-1 px-2 border border-purple-500/30">
                  <span className="text-[10px] text-cyan-300 font-bold flex items-center justify-center gap-1">
                    <Mic className="w-3 h-3" /> 4 of 8 Guest Seats Speaking Live
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Carousel dots if multiple featured */}
          {featuredRooms.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-3">
              {featuredRooms.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    i === currentIndex
                      ? 'w-6 bg-gradient-to-r from-violet-500 to-cyan-400'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
