import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Video, 
  Mic, 
  Radio, 
  Camera, 
  Settings2, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  AlertCircle,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';
import { CategoryId, LiveRoom, StreamerProfile, StreamType } from '../../types';
import { CATEGORIES } from '../../data/mockData';

interface GoLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StreamerProfile;
  onStartRoom: (newRoom: LiveRoom) => void;
  initialMode?: 'video' | 'audio';
}

export const GoLiveModal: React.FC<GoLiveModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onStartRoom,
  initialMode = 'audio',
}) => {
  const [streamType, setStreamType] = useState<StreamType>(initialMode);
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('audio_adda');
  const [tagInput, setTagInput] = useState('Adda, Live, Chill');
  const [isMultiGuest, setIsMultiGuest] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (initialMode) {
      setStreamType(initialMode);
      if (initialMode === 'audio') {
        setSelectedCategory('audio_adda');
      } else {
        setSelectedCategory('gaming');
      }
    }
  }, [initialMode]);

  // Handle local camera & mic preview
  useEffect(() => {
    if (!isOpen) {
      // stop stream when modal closes
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      return;
    }

    if (streamType === 'video' && cameraActive) {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          mediaStreamRef.current = stream;
          if (videoPreviewRef.current) {
            videoPreviewRef.current.srcObject = stream;
          }
          setHasCameraPermission(true);
        })
        .catch((err) => {
          console.warn('Camera preview not available or permission denied:', err);
          setHasCameraPermission(false);
        });
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, streamType, cameraActive]);

  if (!isOpen) return null;

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || (streamType === 'audio' ? '🎙️ Open 8-Seat Audio Adda' : '🔥 Live Gaming & Talk');

    const newRoom: LiveRoom = {
      id: `room_custom_${Date.now()}`,
      title: finalTitle,
      host: {
        ...currentUser,
        isLive: true,
      },
      type: streamType,
      category: selectedCategory,
      viewersCount: 1,
      startedAt: 'Just now',
      coverImage: currentUser.coverPhoto || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      tags: tagInput.split(',').map((t) => t.trim()).filter(Boolean),
      likesCount: 12,
      isMultiGuest: isMultiGuest,
      maxSeats: 8,
      seats: Array.from({ length: 8 }).map((_, i) => ({
        seatIndex: i,
        isLocked: false,
        occupant: null,
      })),
      isFeatured: false,
    };

    onStartRoom(newRoom);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0d091e] border border-purple-800/40 p-5 sm:p-7 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-900/30">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-900/40">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Start Your Broadcast</h2>
              <p className="text-xs text-purple-300">
                Setup your 8-Seat Voice Adda or High-Definition Video Live Stream
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

        <form onSubmit={handleLaunch} className="mt-5 space-y-5">
          {/* Select Mode: Video vs Audio Adda */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
              Streaming Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setStreamType('audio');
                  setSelectedCategory('audio_adda');
                }}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                  streamType === 'audio'
                    ? 'bg-gradient-to-br from-purple-900/60 to-fuchsia-900/40 border-purple-500 text-white shadow-lg shadow-purple-900/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-2 rounded-xl ${streamType === 'audio' ? 'bg-purple-600 text-white' : 'bg-slate-800'}`}>
                  <Mic className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">8-Seat Audio Adda</div>
                  <div className="text-[11px] text-purple-300 mt-0.5">
                    Multi-guest voice room with 8 interactive live guest microphones.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStreamType('video')}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                  streamType === 'video'
                    ? 'bg-gradient-to-br from-violet-900/60 to-pink-900/40 border-pink-500 text-white shadow-lg shadow-pink-900/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-2 rounded-xl ${streamType === 'video' ? 'bg-pink-600 text-white' : 'bg-slate-800'}`}>
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Video Live Stream</div>
                  <div className="text-[11px] text-purple-300 mt-0.5">
                    HD camera or screen share with live comments & gift bursts.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Room Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-1.5">
              Room Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                streamType === 'audio'
                  ? 'e.g. ☕ Night Adda & Melodies | Mic Open for Guests!'
                  : 'e.g. 🎮 Valorant Radiant Rank Push + Squad Voice!'
              }
              className="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-purple-900/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-1.5">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as CategoryId)}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-purple-900/40 text-sm text-white focus:outline-none focus:border-purple-500"
            >
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.banglaName || ''})
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-1.5">
              Room Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Adda, Chill, Gaming, Music"
              className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Device & Guest Options */}
          <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-900/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Enable 8 Guest Microphone Seats</span>
              </div>
              <input
                type="checkbox"
                checked={isMultiGuest}
                onChange={(e) => setIsMultiGuest(e.target.checked)}
                className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
              />
            </div>

            {streamType === 'video' && (
              <div className="flex items-center justify-between pt-2 border-t border-purple-900/30">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Camera className="w-4 h-4 text-pink-400" />
                  <span>Preview Local Web Camera</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCameraActive(!cameraActive)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    cameraActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {cameraActive ? 'Camera ON' : 'Test Camera'}
                </button>
              </div>
            )}

            {/* Video Preview Canvas if camera active */}
            {streamType === 'video' && cameraActive && (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-purple-500/40 mt-2">
                <video
                  ref={videoPreviewRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-emerald-400">
                  Live Camera Feed Active
                </span>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-extrabold text-sm shadow-xl shadow-fuchsia-600/30 hover:shadow-fuchsia-600/50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Launch Live Adda Room</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
