import React from 'react';
import { 
  Users, 
  Mic, 
  Radio, 
  ShieldCheck, 
  Heart, 
  Headphones, 
  Play 
} from 'lucide-react';
import { LiveRoom, StreamerProfile } from '../../types';

interface StreamCardProps {
  room: LiveRoom;
  onOpenRoom: (room: LiveRoom) => void;
  onOpenProfile: (profile: StreamerProfile) => void;
}

export const StreamCard: React.FC<StreamCardProps> = ({
  room,
  onOpenRoom,
  onOpenProfile,
}) => {
  const isAudioAdda = room.type === 'audio';
  const occupiedSeatsCount = room.seats ? room.seats.filter((s) => s.occupant !== null && s.occupant !== undefined).length : 0;

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden bg-[#0e0b1b] border border-purple-900/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/40 hover:-translate-y-1">
      {/* Thumbnail Container */}
      <div 
        onClick={() => onOpenRoom(room)}
        className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 cursor-pointer"
      >
        <img
          src={room.coverImage}
          alt={room.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b1b] via-transparent to-black/40 opacity-90 group-hover:opacity-75 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {/* Live Type Badge */}
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide shadow-md ${
                isAudioAdda
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-600/30'
                  : 'bg-rose-600 text-white shadow-rose-600/40 animate-pulse'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              {isAudioAdda ? 'AUDIO ADDA' : 'LIVE'}
            </span>

            {isAudioAdda && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-semibold text-cyan-300 border border-cyan-500/30">
                <Mic className="w-3 h-3" />
                {occupiedSeatsCount + 1}/8 on mic
              </span>
            )}
          </div>

          {/* Viewer Count */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-[11px] font-semibold text-slate-200 border border-white/10">
            <Users className="w-3 h-3 text-rose-400" />
            {room.viewersCount >= 1000
              ? `${(room.viewersCount / 1000).toFixed(1)}k`
              : room.viewersCount}
          </span>
        </div>

        {/* Play Icon Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-purple-900/50 scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Active Guest Avatars Pill (for 8-Seat Rooms) */}
        {isAudioAdda && room.seats && occupiedSeatsCount > 0 && (
          <div className="absolute bottom-2 left-2.5 flex items-center -space-x-1.5 bg-black/60 backdrop-blur-xs px-2 py-1 rounded-full border border-purple-500/30">
            {room.seats
              .filter((s) => s.occupant)
              .slice(0, 4)
              .map((s, idx) => (
                <img
                  key={idx}
                  src={s.occupant!.avatar}
                  alt={s.occupant!.name}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-purple-400"
                  title={s.occupant!.name}
                />
              ))}
            <span className="text-[9px] font-bold text-slate-300 pl-2">
              +{occupiedSeatsCount} guests
            </span>
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="p-3.5 flex flex-col justify-between flex-1 gap-3">
        <div className="flex items-start gap-3">
          {/* Host Avatar */}
          <button
            onClick={() => onOpenProfile(room.host)}
            className="relative shrink-0 group/host cursor-pointer"
          >
            <img
              src={room.host.avatar}
              alt={room.host.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-600/40 group-hover/host:ring-cyan-400 transition-all"
            />
            <span className="absolute -bottom-1 -right-1 px-1 rounded-full bg-violet-900 text-[8px] font-bold text-purple-200 border border-black">
              {room.host.level}
            </span>
          </button>

          {/* Title & Host info */}
          <div className="min-w-0 flex-1">
            <h3
              onClick={() => onOpenRoom(room)}
              className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1 cursor-pointer"
              title={room.title}
            >
              {room.title}
            </h3>

            <div className="flex items-center gap-1.5 mt-1">
              <button
                onClick={() => onOpenProfile(room.host)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors truncate flex items-center gap-1 cursor-pointer"
              >
                <span>{room.host.name}</span>
                {room.host.isVerified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer info: tags & likes */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-purple-900/15">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-purple-950/40 text-purple-300 border border-purple-900/30 truncate">
              {room.tags[0] || 'Live'}
            </span>
            <span className="text-[10px] text-slate-400 hidden xs:inline">
              {room.startedAt}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Heart className="w-3.5 h-3.5 text-pink-500/80" />
            <span>{room.likesCount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
