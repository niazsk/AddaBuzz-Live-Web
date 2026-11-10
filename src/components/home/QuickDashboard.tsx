import React from 'react';
import { 
  Gem, 
  Coins, 
  Flame, 
  Zap, 
  Mic2, 
  Video, 
  Clock, 
  TrendingUp, 
  Award, 
  Radio, 
  Gift, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { StreamerProfile } from '../../types';

interface QuickDashboardProps {
  currentUser: StreamerProfile;
  diamonds: number;
  coins: number;
  onOpenGoLive: (mode?: 'video' | 'audio') => void;
  onOpenWallet: () => void;
  onClaimDailyCoins: () => void;
  dailyClaimed: boolean;
  onClose?: () => void;
}

export const QuickDashboard: React.FC<QuickDashboardProps> = ({
  currentUser,
  diamonds,
  coins,
  onOpenGoLive,
  onOpenWallet,
  onClaimDailyCoins,
  dailyClaimed,
  onClose,
}) => {
  return (
    <div className="w-full mb-8 rounded-3xl bg-gradient-to-br from-[#120b29] via-[#0d091e] to-[#080612] border border-purple-800/40 p-4 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-purple-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/40">
            <Zap className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <span>Quick Access Dashboard</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active
              </span>
            </h2>
            <p className="text-xs text-purple-300/80">
              Your instant creator control hub, currency overview, and stream shortcuts
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs font-semibold text-purple-400 hover:text-white px-3 py-1 rounded-xl bg-purple-950/40 border border-purple-800/30 transition-colors"
          >
            Hide Dashboard
          </button>
        )}
      </div>

      {/* Grid of Key Metrics & Actions */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mt-4">
        {/* Diamond Wallet Card */}
        <div 
          onClick={onOpenWallet}
          className="p-4 rounded-2xl bg-[#140f2b]/80 border border-purple-700/30 hover:border-cyan-400/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-purple-300">
            <span className="font-semibold flex items-center gap-1.5">
              <Gem className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
              Diamonds
            </span>
            <span className="text-[10px] text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded-md">
              Wallet
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            {diamonds.toLocaleString()} <span className="text-xs font-normal text-purple-300">💎</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1 flex items-center justify-between">
            <span>For gifts & room boosts</span>
            <ChevronRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Free Activity Coins Card */}
        <div className="p-4 rounded-2xl bg-[#140f2b]/80 border border-purple-700/30 hover:border-amber-400/50 transition-all group">
          <div className="flex items-center justify-between text-xs text-purple-300">
            <span className="font-semibold flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-400" />
              Free Coins
            </span>
            <button
              onClick={onClaimDailyCoins}
              disabled={dailyClaimed}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                dailyClaimed
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                  : 'bg-amber-500 text-black hover:bg-amber-400 animate-pulse'
              }`}
            >
              {dailyClaimed ? 'Claimed ✓' : 'Claim +50'}
            </button>
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            {coins.toLocaleString()} <span className="text-xs font-normal text-amber-300">🪙</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1">
            Free-First rewards for watching & chatting
          </p>
        </div>

        {/* Stream Level & XP Card */}
        <div className="p-4 rounded-2xl bg-[#140f2b]/80 border border-purple-700/30">
          <div className="flex items-center justify-between text-xs text-purple-300">
            <span className="font-semibold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-fuchsia-400" />
              Creator Level
            </span>
            <span className="text-[10px] text-fuchsia-300 font-bold bg-fuchsia-950/60 px-2 py-0.5 rounded-md">
              Level {currentUser.level}
            </span>
          </div>
          <div className="mt-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
              <span>XP Progress</span>
              <span className="font-bold text-white">68%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 rounded-full w-[68%]" />
            </div>
          </div>
          <p className="text-[11px] text-slate-300 mt-2">
            Host more addas to unlock VIP crown badges
          </p>
        </div>

        {/* Quick Launch Actions */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/40 to-slate-900/80 border border-purple-600/40 flex flex-col justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
            Instant Studio Launch
          </span>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={() => onOpenGoLive('video')}
              className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-md shadow-pink-600/30 transition-all cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video Live</span>
            </button>

            <button
              onClick={() => onOpenGoLive('audio')}
              className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-700 hover:from-purple-700 hover:to-indigo-600 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 border border-purple-500/40 transition-all cursor-pointer"
            >
              <Mic2 className="w-3.5 h-3.5 text-cyan-300" />
              <span>8-Seat Mic</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
