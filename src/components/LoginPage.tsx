import React, { useState } from 'react';
import { firebaseAuth } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { LogIn, UserPlus, Mail, Lock, User, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onAuthenticated: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (mode === 'signup') {
        const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        await updateProfile(cred.user, { displayName: name || username || email.split('@')[0] });
        setMessage({ type: 'success', text: 'Account created! You are now signed in.' });
        onAuthenticated();
      } else {
        await signInWithEmailAndPassword(firebaseAuth, email, password);
        onAuthenticated();
      }
    } catch (err: any) {
      const code = err?.code || '';
      let text = err?.message || 'Authentication failed.';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        text = 'Invalid email or password. Please check and try again.';
      } else if (code === 'auth/invalid-email') {
        text = 'Please enter a valid email address.';
      } else if (code === 'auth/too-many-requests') {
        text = 'Too many attempts. Please try again later.';
      } else if (code === 'auth/network-request-failed') {
        text = 'Network error. Check your connection.';
      }
      setMessage({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
      onAuthenticated();
    } catch (err: any) {
      const code = err?.code || '';
      let text = err?.message || 'Google sign-in failed.';
      if (code === 'auth/popup-closed-by-user') text = 'Sign-in cancelled.';
      else if (code === 'auth/popup-blocked') text = 'Popup blocked. Allow popups and try again.';
      else if (code === 'auth/account-exists-with-different-credential') text = 'Account exists with a different sign-in method.';
      setMessage({ type: 'error', text });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07070D] p-4">
      <div className="w-full max-w-md rounded-3xl bg-[#0c091b] border border-purple-800/40 shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-extrabold text-white">AddaBuzz Live</h1>
          </div>
          <p className="text-slate-400 text-sm">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {message && (
            <div
              className={`text-sm px-3 py-2 rounded-lg ${
                message.type === 'success' ? 'bg-emerald-950/60 text-emerald-300' : 'bg-rose-950/60 text-rose-300'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-700" />
          <span className="text-xs text-slate-500">OR</span>
          <div className="flex-1 h-px bg-slate-700" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="w-full py-3 rounded-xl bg-white text-slate-900 font-bold flex items-center justify-center gap-2 hover:bg-slate-100 cursor-pointer"
        >
          Sign in with Google
        </button>

        <div className="mt-4 text-center text-sm text-slate-400">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button onClick={() => setMode('signup')} className="text-cyan-400 font-semibold cursor-pointer">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-cyan-400 font-semibold cursor-pointer">
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
