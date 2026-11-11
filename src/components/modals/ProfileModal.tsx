import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Users, 
  Heart, 
  Award, 
  Radio, 
  MapPin, 
  Calendar, 
  Gift, 
  Share2, 
  UserPlus, 
  UserCheck,
  Flame,
  Mic2
} from 'lucide-react';
import { StreamerProfile, LiveRoom } from '../../types';

interface ProfileModalProps {
  profile: StreamerProfile | null;
  onClose: () => void;
  onToggleFollow: (id: string) => void;
  allRooms: LiveRoom[];
  onOpenRoom: (room: LiveRoom) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  onClose,
  onToggleFollow,
  allRooms,
  onOpenRoom,
}) => {
  if (!profile) return null;

  const currentLiveRoom = allRooms.find((r) => r.host.id === profile.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0c091b] border border-purple-800/40 shadow-2xl overflow-hidden my-6">
        
        {/* Cover Photo */}
        <div className="relative h-44 w-full bg-slate-900">
          <img
            src={profile.coverPhoto}
            alt={profile.name}
            className="w-full h-full object-cover filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c091b] via-transparent to-black/40" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Live Badge if streaming */}
          {profile.isLive && currentLiveRoom && (
            <button
              onClick={() => {
                onClose();
                onOpenRoom(currentLiveRoom);
              }}
              className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/40 animate-pulse cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>Watch Live Now</span>
            </button>
          )}
        </div>

        {/* Profile Info Body */}
        <div className="p-6 pt-0 relative">
          {/* Avatar with Level Ring */}
          <div className="flex justify-between items-end -mt-14 mb-4">
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-[#0c091b] border-2 border-purple-500 shadow-xl"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full bg-violet-600 text-[10px] font-black text-white border border-black shadow-md">
                Lv.{profile.level}
              </span>
            </div>

            {/* Follow / Edit Button */}
            <button
              onClick={() => onToggleFollow(profile.id)}
              className={`px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                profile.isFollowed
                  ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:from-violet-500 hover:to-pink-500'
              }`}
            >
              {profile.isFollowed ? (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Follow Creator</span>
                </>
              )}
            </button>
          </div>

          {/* Name & Handle */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">{profile.name}</h2>
              {profile.isVerified && (
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              )}
            </div>
            <p className="text-xs text-purple-400 font-semibold">@{profile.username}</p>
          </div>

          {/* Bio */}
          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            {profile.bio}
          </p>

          {/* Location & Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-pink-400" /> {profile.country}
            </span>
            <span>•</span>
            {profile.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-purple-950/40 text-purple-300 border border-purple-900/40 text-[10px]"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 my-5 p-3.5 rounded-2xl bg-[#120e26] border border-purple-900/30 text-center">
            <div>
              <div className="text-base font-extrabold text-white">
                {profile.followersCount.toLocaleString()}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                Followers
              </div>
            </div>

            <div>
              <div className="text-base font-extrabold text-white">
                {profile.followingCount.toLocaleString()}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                Following
              </div>
            </div>

            <div>
              <div className="text-base font-extrabold text-cyan-400 flex items-center justify-center gap-1">
                <Gift className="w-3.5 h-3.5" />
                <span>{profile.totalGiftsReceived.toLocaleString()}</span>
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                Gifts Received
              </div>
            </div>
          </div>

          {/* Wallet (Coins & Diamonds) */}
          <div className="flex items-center justify-center gap-6 mb-5 p-3 rounded-2xl bg-[#120e26] border border-purple-900/30">
            <div className="flex items-center gap-2">
              <span className="text-lg">💎</span>
              <div>
                <div className="text-sm font-extrabold text-cyan-300">{(profile.diamonds ?? 0).toLocaleString()}</div>
                <div className="text-[9px] uppercase font-bold text-slate-400">Diamonds</div>
              </div>
            </div>
            <div className="w-px h-8 bg-purple-900/40" />
            <div className="flex items-center gap-2">
              <span className="text-lg">🪙</span>
              <div>
                <div className="text-sm font-extrabold text-amber-300">{(profile.coins ?? 0).toLocaleString()}</div>
                <div className="text-[9px] uppercase font-bold text-slate-400">Coins</div>
              </div>
            </div>
          </div>

          {/* Achievements / Badges */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Badges & Milestones
            </span>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-900/40 border border-purple-700/40 text-purple-200 text-xs font-semibold">
                <Award className="w-3.5 h-3.5 text-amber-400" /> Top Host 2026
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-200 text-xs font-semibold">
                <Mic2 className="w-3.5 h-3.5 text-cyan-400" /> 8-Seat Adda Star
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-pink-950/40 border border-pink-800/40 text-pink-200 text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 text-pink-400" /> 100K Views
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
