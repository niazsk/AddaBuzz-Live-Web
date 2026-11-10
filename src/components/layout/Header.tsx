import React, { useState } from 'react';
import { 
  Radio, 
  Search, 
  Video, 
  Gem, 
  Bell, 
  X, 
  Sparkles,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { StreamerProfile } from '../../types';
import { Database } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenGoLive: () => void;
  onOpenWallet: () => void;
  onOpenProfile: (profile: StreamerProfile) => void;
  onOpenSupabase: () => void;
  isSupabaseConnected: boolean;
  currentUser: StreamerProfile;
  diamonds: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenGoLive,
  onOpenWallet,
  onOpenProfile,
  onOpenSupabase,
  isSupabaseConnected,
  currentUser,
  diamonds,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Ayesha Chowdhury is LIVE!',
      desc: 'Playing Valorant Radiant Rank with squad. Join the voice adda!',
      time: '12m ago',
      read: false,
    },
    {
      id: 2,
      title: 'Daily Login Reward Ready',
      desc: 'You earned 50 free activity coins for checking in today!',
      time: '1h ago',
      read: false,
    },
    {
      id: 3,
      title: 'Mic Seat Approved',
      desc: 'Nafis Rahman accepted your guest request in Night Adda.',
      time: '3h ago',
      read: true,
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#0a0814]/90 backdrop-blur-xl border-b border-purple-900/20 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 shrink-0">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-400 p-[1.5px] transition-transform duration-300 group-hover:scale-105 shadow-lg shadow-purple-900/30">
            <div className="w-full h-full bg-[#0B0B14] rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center">
                Adda<span className="text-gradient">Buzz</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-sm shadow-red-500/40 animate-pulse">
                LIVE
              </span>
            </div>
            <span className="hidden sm:inline-block text-[10px] text-slate-400 tracking-wide font-medium">
              Connect • Stream • Chat
            </span>
          </div>
        </a>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-xl mx-2 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search live streams, 8-seat addas, streamers, tags..."
            className="w-full h-10 pl-10 pr-9 rounded-full bg-slate-900/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Action Controls & User Metrics */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Go Live Button */}
        <button
          onClick={onOpenGoLive}
          className="relative inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 transition-all duration-300 shadow-md shadow-fuchsia-600/30 hover:shadow-lg hover:shadow-fuchsia-600/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Video className="w-4 h-4 text-white animate-pulse" />
          <span className="hidden xs:inline">Go Live</span>
        </button>

        {/* Supabase Integration Button */}
        <button
          onClick={onOpenSupabase}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
            isSupabaseConnected
              ? 'bg-emerald-950/60 hover:bg-emerald-900/60 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/20'
              : 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-700 text-slate-300 hover:text-white'
          }`}
          title="Supabase Database & Auth"
        >
          <Database className={`w-3.5 h-3.5 ${isSupabaseConnected ? 'text-emerald-400' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">Supabase</span>
          <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
        </button>

        {/* Diamond Wallet Badge */}
        <button
          onClick={onOpenWallet}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800/90 border border-purple-500/30 hover:border-purple-500/60 transition-all cursor-pointer group"
          title="AddaBuzz Diamond Wallet"
        >
          <Gem className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold text-slate-100">{diamonds.toLocaleString()}</span>
          <span className="text-[10px] text-purple-400 font-semibold hidden sm:inline">💎</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full bg-slate-900/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-[#0a0814] animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-[#0a0814]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl bg-[#0f0c1e] border border-purple-900/30 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-sm text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-semibold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Mark read
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      item.read
                        ? 'bg-slate-900/40 border-slate-800/40 text-slate-400'
                        : 'bg-purple-950/20 border-purple-800/30 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-white flex items-center gap-1">
                        <Flame className="w-3 h-3 text-pink-400" /> {item.title}
                      </span>
                      <span className="text-[10px] text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Current User Profile Pill */}
        <button
          onClick={() => onOpenProfile(currentUser)}
          className="flex items-center gap-2 p-1 pl-1.5 sm:pr-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer group"
        >
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-purple-500/50 group-hover:ring-cyan-400 transition-all"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-black" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-white leading-none">
              {currentUser.name.split(' ')[0]}
            </span>
            <span className="text-[10px] text-purple-400 font-medium">
              Lv.{currentUser.level} Host
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
