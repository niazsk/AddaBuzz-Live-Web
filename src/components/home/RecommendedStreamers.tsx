import React from 'react';
import { ShieldCheck, UserPlus, UserCheck, Flame, Sparkles } from 'lucide-react';
import { StreamerProfile, LiveRoom } from '../../types';

interface RecommendedStreamersProps {
  streamers: StreamerProfile[];
  onOpenProfile: (profile: StreamerProfile) => void;
  onToggleFollow: (id: string) => void;
  allRooms: LiveRoom[];
  onOpenRoom: (room: LiveRoom) => void;
}

export const RecommendedStreamers: React.FC<RecommendedStreamersProps> = ({
  streamers,
  onOpenProfile,
  onToggleFollow,
  allRooms,
  onOpenRoom,
}) => {
  return (
    <div className="w-full my-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base sm:text-lg font-bold text-white">Popular Streamers & Hosts</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/40 text-cyan-300 border border-cyan-800/30">
            Top Creators
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {streamers.map((streamer) => {
          const liveRoom = allRooms.find((r) => r.host.id === streamer.id);

          return (
            <div
              key={streamer.id}
              className="flex flex-col items-center p-3.5 rounded-2xl bg-[#0e0b1c] border border-purple-900/20 hover:border-purple-500/40 transition-all text-center group"
            >
              {/* Avatar with Live Ring or Level */}
              <div
                onClick={() => {
                  if (liveRoom) onOpenRoom(liveRoom);
                  else onOpenProfile(streamer);
                }}
                className="relative cursor-pointer mb-2.5"
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 ${
                    streamer.isLive
                      ? 'bg-gradient-to-tr from-rose-500 via-fuchsia-500 to-cyan-400 animate-pulse'
                      : 'bg-slate-800'
                  }`}
                >
                  <img
                    src={streamer.avatar}
                    alt={streamer.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>

                {streamer.isLive ? (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-rose-600 text-[9px] font-extrabold text-white tracking-wider border border-[#0e0b1c] shadow-sm">
                    LIVE
                  </span>
                ) : (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1 rounded-full bg-slate-800 text-[9px] font-bold text-purple-300 border border-slate-700">
                    Lv.{streamer.level}
                  </span>
                )}
              </div>

              {/* Name & Handle */}
              <button
                onClick={() => onOpenProfile(streamer)}
                className="font-bold text-xs sm:text-sm text-slate-100 hover:text-cyan-300 transition-colors truncate max-w-full flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="truncate">{streamer.name}</span>
                {streamer.isVerified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                )}
              </button>

              <span className="text-[10px] text-slate-300 truncate max-w-full mt-0.5">
                @{streamer.username}
              </span>

              {/* Followers */}
              <span className="text-[10px] font-semibold text-purple-400 mt-1">
                {streamer.followersCount.toLocaleString()} followers
              </span>

              {/* Follow / Unfollow Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFollow(streamer.id);
                }}
                className={`mt-2.5 w-full py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  streamer.isFollowed
                    ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-md shadow-purple-900/40'
                }`}
              >
                {streamer.isFollowed ? (
                  <>
                    <UserCheck className="w-3 h-3 text-emerald-400" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3 h-3" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
