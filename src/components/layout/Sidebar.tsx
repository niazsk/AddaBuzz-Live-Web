import React from 'react';
import { 
  Flame, 
  Mic2, 
  Gamepad2, 
  Music, 
  Users, 
  Trophy, 
  Sparkles, 
  Swords, 
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import { CategoryId, StreamerProfile, LiveRoom } from '../../types';

interface SidebarProps {
  activeCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  followedStreamers: StreamerProfile[];
  onOpenRoom: (room: LiveRoom) => void;
  onOpenProfile: (profile: StreamerProfile) => void;
  allRooms: LiveRoom[];
  onToggleDashboard?: () => void;
  isDashboardOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeCategory,
  onSelectCategory,
  followedStreamers,
  onOpenRoom,
  onOpenProfile,
  allRooms,
  onToggleDashboard,
  isDashboardOpen,
}) => {
  const navItems = [
    { id: 'all' as CategoryId, label: 'All Live', icon: Flame, badge: 'Hot' },
    { id: 'audio_adda' as CategoryId, label: 'Audio Adda', icon: Mic2, badge: '8-Seat' },
    { id: 'gaming' as CategoryId, label: 'Gaming Streams', icon: Gamepad2, badge: null },
    { id: 'music' as CategoryId, label: 'Music & Jamming', icon: Music, badge: null },
    { id: 'pk_battle' as CategoryId, label: 'PK Battles', icon: Swords, badge: 'Live' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 bg-[#0a0814]/95 border-r border-purple-900/15 p-4 overflow-y-auto no-scrollbar shrink-0 justify-between">
      <div className="space-y-6">
        {/* Quick Access Dashboard Toggle */}
        {onToggleDashboard && (
          <button
            onClick={onToggleDashboard}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isDashboardOpen
                ? 'bg-gradient-to-r from-purple-900/60 to-violet-800/40 border-purple-500/50 text-white shadow-lg shadow-purple-900/30'
                : 'bg-slate-900/40 border-slate-800/60 text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className={`w-4 h-4 ${isDashboardOpen ? 'text-cyan-400' : 'text-purple-400'}`} />
              <span>Quick Dashboard</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
              Live
            </span>
          </button>
        )}

        {/* Discovery & Main Nav */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 px-3">
            Discovery
          </span>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectCategory(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/15 text-white border border-purple-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-purple-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        item.badge === '8-Seat'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : item.badge === 'Hot'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Followed Streamers Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-400" /> Followed Addas
            </span>
            <span className="text-[10px] text-purple-400 font-semibold">
              {followedStreamers.filter((s) => s.isLive).length} LIVE
            </span>
          </div>

          <div className="space-y-1">
            {followedStreamers.map((streamer) => {
              const liveRoom = allRooms.find((r) => r.host.id === streamer.id);
              return (
                <div
                  key={streamer.id}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-900/60 transition-colors group cursor-pointer"
                  onClick={() => {
                    if (liveRoom) onOpenRoom(liveRoom);
                    else onOpenProfile(streamer);
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={streamer.avatar}
                        alt={streamer.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-500/30 group-hover:ring-cyan-400 transition-all"
                      />
                      {streamer.isLive && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0a0814]" />
                      )}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 truncate">
                        {streamer.name}
                      </div>
                      <div className="text-[10px] text-slate-300 truncate">
                        {streamer.tags[0] || streamer.country}
                      </div>
                    </div>
                  </div>

                  {streamer.isLive ? (
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      <span className="text-[10px] font-bold text-rose-400">
                        {liveRoom ? `${(liveRoom.viewersCount / 1000).toFixed(1)}k` : 'LIVE'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-300">offline</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Footer System Status */}
      <div className="pt-4 border-t border-purple-900/15 text-[11px] text-slate-300 flex items-center justify-between">
        <span>© 2026 AddaBuzz Live</span>
        <span className="text-purple-400 hover:text-purple-300 cursor-pointer flex items-center gap-0.5">
          Help <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </aside>
  );
};
