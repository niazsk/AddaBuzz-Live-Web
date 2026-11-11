import React from 'react';
import { 
  X, 
  Gem, 
  Coins, 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowUpRight,
  Clock,
  Zap
} from 'lucide-react';
import { VIRTUAL_GIFTS } from '../../data/mockData';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  diamonds: number;
  coins: number;
  onClaimDailyCoins: () => void;
  dailyClaimed: boolean;
  onAddDiamondsBonus: (amount: number) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  diamonds,
  coins,
  onClaimDailyCoins,
  dailyClaimed,
  onAddDiamondsBonus,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0d091e] border border-purple-800/40 p-6 sm:p-7 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-900/30">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <Gem className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">AddaBuzz Wallet</h2>
              <p className="text-xs text-purple-300">
                Manage your Diamonds, Free Activity Coins, and Gift Transactions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currency Balance Cards */}
        <div className="grid grid-cols-2 gap-3.5 mt-5">
          {/* Diamonds */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-900/80 border border-purple-600/30">
            <div className="flex items-center justify-between text-xs text-purple-300">
              <span className="font-semibold flex items-center gap-1.5">
                <Gem className="w-4 h-4 text-cyan-400" /> Diamonds
              </span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 font-bold px-1.5 py-0.5 rounded">
                Premium
              </span>
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              {diamonds.toLocaleString()} <span className="text-xs text-purple-300">💎</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              Used for animated 3D gifts and creator support
            </p>
            <button
              onClick={() => onAddDiamondsBonus(250)}
              className="mt-3 w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              + Get 250 Test Diamonds
            </button>
          </div>

          {/* Activity Coins */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-900/80 border border-amber-600/30">
            <div className="flex items-center justify-between text-xs text-amber-300">
              <span className="font-semibold flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" /> Free Coins
              </span>
              <span className="text-[10px] bg-amber-950 text-amber-300 font-bold px-1.5 py-0.5 rounded">
                Earned
              </span>
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              {coins.toLocaleString()} <span className="text-xs text-amber-300">🪙</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              Earned free by participating and daily streaks
            </p>
            <button
              onClick={onClaimDailyCoins}
              disabled={dailyClaimed}
              className={`mt-3 w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                dailyClaimed
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-800/40'
                  : 'bg-amber-500 text-black hover:bg-amber-400 animate-pulse'
              }`}
            >
              {dailyClaimed ? 'Claimed Today ✓' : 'Claim Daily +50 Coins'}
            </button>
          </div>
        </div>

        {/* Free-First Architecture Note */}
        <div className="mt-5 p-3.5 rounded-2xl bg-purple-950/20 border border-purple-800/30 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-purple-200 leading-relaxed">
            <strong className="text-white block mb-0.5">Free-First Technology Policy</strong>
            All wallet transactions, gifts, and ledger balances are processed via server-authoritative Supabase PostgreSQL functions with zero client tampering.
          </div>
        </div>

        {/* Gift Catalog Section */}
        <div className="mt-5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-pink-400" /> Available Virtual Gifts
          </h3>
          <div className="grid grid-cols-4 gap-2 max-h-44 overflow-y-auto no-scrollbar pr-1">
            {VIRTUAL_GIFTS.map((g) => (
              <div
                key={g.id}
                className="p-2 rounded-xl bg-slate-900/60 border border-purple-900/30 flex flex-col items-center text-center"
              >
                <span className="text-2xl">{g.icon}</span>
                <span className="text-[10px] font-bold text-white mt-1 truncate max-w-full">
                  {g.name}
                </span>
                <span className="text-[9px] text-cyan-300 font-semibold">
                  💎 {g.costInCoins}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
