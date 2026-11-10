import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Key, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  LogIn, 
  UserPlus, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  Server,
  Zap
} from 'lucide-react';
import { 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  clearSupabaseConfig, 
  testSupabaseConnection, 
  getSupabaseClient 
} from '../../lib/supabase';
import { MASTER_MIGRATION_SQL } from '../../lib/migrationSql';
import { StreamerProfile } from '../../types';

interface SupabaseConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAuthenticated?: (userProfile: StreamerProfile) => void;
}

export const SupabaseConnectModal: React.FC<SupabaseConnectModalProps> = ({
  isOpen,
  onClose,
  onUserAuthenticated,
}) => {
  const [activeTab, setActiveTab] = useState<'connect' | 'auth' | 'sql'>('connect');
  
  // Connect Form State
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Auth Form State
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load current config on open and auto-test if credentials present
  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      setSupabaseUrl(config.url);
      setAnonKey(config.anonKey);
      setAuthMessage(null);

      if (config.url && config.anonKey) {
        setIsTesting(true);
        testSupabaseConnection(config.url, config.anonKey).then((result) => {
          setIsTesting(false);
          setTestResult(result);
        });
      } else {
        setTestResult(null);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Testing & Saving Supabase connection
  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !anonKey.trim()) {
      setTestResult({
        success: false,
        message: 'Please provide both your Supabase Project URL and Anon Public Key.',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const result = await testSupabaseConnection(supabaseUrl.trim(), anonKey.trim());
    setIsTesting(false);
    setTestResult(result);

    if (result.success) {
      saveSupabaseConfig(supabaseUrl.trim(), anonKey.trim());
    }
  };

  // Disconnect / Reset credentials
  const handleDisconnect = () => {
    clearSupabaseConfig();
    setSupabaseUrl('');
    setAnonKey('');
    setTestResult(null);
    setAuthMessage({ type: 'success', text: 'Supabase configuration reset to local demo mode.' });
  };

  // Copy full SQL script to clipboard
  const copyMigrationPath = () => {
    navigator.clipboard?.writeText(MASTER_MIGRATION_SQL);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Supabase Auth Handler (Sign Up / Sign In)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const client = getSupabaseClient();

    if (!client) {
      setAuthMessage({
        type: 'error',
        text: 'Please connect your Supabase project in the "Connect API" tab first.',
      });
      return;
    }

    setAuthLoading(true);
    setAuthMessage(null);

    try {
      if (authMode === 'signup') {
        const { data, error } = await client.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              username: username.trim() || email.split('@')[0],
              name: name.trim() || username.trim() || 'Adda Streamer',
              gender: gender,
            },
          },
        });

        if (error) throw error;

        setAuthMessage({
          type: 'success',
          text: data.session
            ? 'Account created and signed in successfully!'
            : 'Account registered! Please check your email inbox to verify your account.',
        });

        if (data.user && onUserAuthenticated) {
          onUserAuthenticated({
            id: data.user.id,
            name: name.trim() || username.trim() || 'Adda Creator',
            username: username.trim() || email.split('@')[0],
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
            coverPhoto: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
            bio: 'AddaBuzz Live Creator & Streamer 🎙️',
            country: 'Bangladesh',
            gender: gender,
            followersCount: 0,
            followingCount: 0,
            level: 1,
            isVerified: false,
            isLive: false,
            totalGiftsReceived: 0,
            tags: ['New Host', 'Adda'],
          });
        }
      } else {
        // Sign in
        const { data, error } = await client.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;

        setAuthMessage({
          type: 'success',
          text: `Welcome back, ${data.user.email}! Signed in successfully.`,
        });

        if (data.user && onUserAuthenticated) {
          const meta = data.user.user_metadata || {};
          onUserAuthenticated({
            id: data.user.id,
            name: meta.name || data.user.email?.split('@')[0] || 'Adda Streamer',
            username: meta.username || data.user.email?.split('@')[0] || 'streamer',
            avatar: meta.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
            coverPhoto: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
            bio: meta.bio || 'AddaBuzz Live Streamer 🎙️',
            country: meta.country || 'Bangladesh',
            gender: meta.gender || 'male',
            followersCount: 15,
            followingCount: 5,
            level: 1,
            isVerified: false,
            isLive: false,
            totalGiftsReceived: 0,
            tags: ['Host'],
          });
        }
      }
    } catch (err: any) {
      setAuthMessage({
        type: 'error',
        text: err?.message || 'Authentication failed. Please check credentials.',
      });
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0c091b] border border-purple-800/40 p-5 sm:p-7 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">Supabase Integration</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Free Tier
                </span>
              </div>
              <p className="text-xs text-purple-300">
                Connect your free PostgreSQL database, Authentication & Realtime engine
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-4 pb-2 border-b border-purple-900/20">
          <button
            onClick={() => setActiveTab('connect')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'connect'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Connect API</span>
          </button>

          <button
            onClick={() => setActiveTab('auth')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'auth'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Supabase Auth</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sql'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>SQL Schema (20 Tables)</span>
          </button>
        </div>

        {/* TAB 1: CONNECT API */}
        {activeTab === 'connect' && (
          <form onSubmit={handleTestAndSave} className="mt-4 space-y-4">
            {/* Active Project Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-500/30">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-extrabold text-white">AddaBuzz Live Project</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                    citiaagytdkomcmkuhkk
                  </span>
                  <span className="text-[10px] text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/40">
                    ap-northeast-2
                  </span>
                </div>
                <a
                  href="https://supabase.com/dashboard/project/citiaagytdkomcmkuhkk/settings/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 hover:text-emerald-200 underline"
                >
                  <span>Get Anon API Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-1.5">
                Supabase Project URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-slate-900 border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Found in: Supabase Dashboard → Settings → API → Project URL
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-1.5">
                Anon Public API Key
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-slate-900 border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Found in: Supabase Dashboard → Settings → API → Project API Keys (anon public)
              </span>
            </div>

            {/* Test result message */}
            {testResult && (
              <div
                className={`p-3 rounded-2xl text-xs flex items-center gap-2.5 ${
                  testResult.success
                    ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/40 border border-rose-500/40 text-rose-200'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isTesting}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Testing Connection...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save & Test Supabase</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDisconnect}
                className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-purple-900/40 transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Free-First policy notice */}
            <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-800/30 text-xs text-purple-200 leading-relaxed">
              <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Strict Free-Technology Policy Verified</span>
              </div>
              Supabase provides 500MB PostgreSQL, 50,000 monthly active users, and Realtime WebSocket subscriptions at 100% free tier.
            </div>
          </form>
        )}

        {/* TAB 2: SUPABASE AUTH */}
        {activeTab === 'auth' && (
          <div className="mt-4 space-y-4">
            <div className="flex rounded-xl bg-slate-900 p-1 border border-purple-900/30">
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  authMode === 'signup'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  authMode === 'login'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {authMode === 'signup' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-purple-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ayesha Rahman"
                        required
                        className="w-full h-9 px-3 rounded-xl bg-slate-900 border border-purple-900/40 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-purple-300 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="ayesha_live"
                        required
                        className="w-full h-9 px-3 rounded-xl bg-slate-900 border border-purple-900/40 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-purple-300 mb-1">
                      Gender Selection
                    </label>
                    <div className="flex gap-4 text-xs text-slate-300">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={gender === 'male'}
                          onChange={() => setGender('male')}
                          className="accent-purple-600"
                        />
                        Male
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={gender === 'female'}
                          onChange={() => setGender('female')}
                          className="accent-purple-600"
                        />
                        Female
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase text-purple-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full h-9 px-3 rounded-xl bg-slate-900 border border-purple-900/40 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-purple-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  minLength={6}
                  className="w-full h-9 px-3 rounded-xl bg-slate-900 border border-purple-900/40 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {authMessage && (
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                    authMessage.type === 'success'
                      ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/40 border border-rose-500/40 text-rose-200'
                  }`}
                >
                  {authMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{authMessage.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-purple-900/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {authLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : authMode === 'signup' ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Free AddaBuzz Account</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In with Supabase</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: SQL SCHEMA MIGRATION */}
        {activeTab === 'sql' && (
          <div className="mt-4 space-y-4">
            <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-800/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-cyan-400" />
                  Ready-to-Run PostgreSQL Migration
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-900 text-purple-200 font-bold">
                  20 Tables + RLS
                </span>
              </div>
              <p className="text-xs text-purple-200 leading-relaxed">
                The migration includes complete schemas for profiles, 8-seat guest rooms, real-time comments, wallet ledger, virtual gifts catalog, follows, blocks, and reports.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 max-h-48 overflow-y-auto no-scrollbar space-y-1">
              <div className="text-emerald-400">-- Migration path:</div>
              <div className="text-cyan-300 font-bold">supabase/migrations/20261110_init_schema.sql</div>
              <div className="text-slate-500 mt-2">-- Includes:</div>
              <div>CREATE TABLE public.profiles (...)</div>
              <div>CREATE TABLE public.live_rooms (...)</div>
              <div>CREATE TABLE public.live_seats (seat_index 0..7) (...)</div>
              <div>CREATE TABLE public.live_messages (...)</div>
              <div>CREATE TABLE public.wallets (...)</div>
              <div>CREATE TABLE public.gift_catalog (...)</div>
              <div>CREATE TABLE public.wallet_transactions (...)</div>
              <div className="text-purple-400">-- Automatic auth.users trigger to create profiles & wallets</div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={copyMigrationPath}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'Instructions Copied!' : 'Copy Migration Instructions'}</span>
              </button>

              <a
                href="https://supabase.com/dashboard/project/citiaagytdkomcmkuhkk/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold underline"
              >
                <span>Open Project SQL Editor</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
