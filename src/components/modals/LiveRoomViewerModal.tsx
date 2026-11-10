import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Heart, 
  Send, 
  Gift, 
  Share2, 
  Users, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Hand, 
  UserPlus, 
  UserCheck,
  MessageCircle,
  Flame,
  Radio,
  Check
} from 'lucide-react';
import { LiveRoom, StreamerProfile, VirtualGift, LiveChatMessage } from '../../types';
import { VIRTUAL_GIFTS, INITIAL_CHAT_MESSAGES } from '../../data/mockData';

interface LiveRoomViewerModalProps {
  room: LiveRoom;
  onClose: () => void;
  onOpenProfile: (profile: StreamerProfile) => void;
  currentUser: StreamerProfile;
  diamonds: number;
  onDeductDiamonds: (amount: number) => boolean;
}

interface FloatingReaction {
  id: number;
  emoji: string;
  left: number; // percentage
}

export const LiveRoomViewerModal: React.FC<LiveRoomViewerModalProps> = ({
  room,
  onClose,
  onOpenProfile,
  currentUser,
  diamonds,
  onDeductDiamonds,
}) => {
  const [messages, setMessages] = useState<LiveChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [likes, setLikes] = useState(room.likesCount);
  const [floatingHearts, setFloatingHearts] = useState<FloatingReaction[]>([]);
  const [showGiftTray, setShowGiftTray] = useState(false);
  const [activeGiftBanner, setActiveGiftBanner] = useState<{ name: string; icon: string; sender: string } | null>(null);
  const [isFollowingHost, setIsFollowingHost] = useState(room.host.isFollowed || false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [userSeatIndex, setUserSeatIndex] = useState<number | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Clone seats so user can interactively join
  const [seats, setSeats] = useState(room.seats || []);

  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Periodic simulated live chatter
  useEffect(() => {
    const chatSamples = [
      'Valo lagche adda ta! ❤️',
      'Nice voice bro! 🎵',
      'Seat khali hole amake ektu dio please 🙏',
      'Dhaka theke dekhchi!',
      'AddaBuzz is super smooth! ⚡',
      'Send some gifts everyone! 💎',
    ];

    const interval = setInterval(() => {
      const randomText = chatSamples[Math.floor(Math.random() * chatSamples.length)];
      const randomUser = `User_${Math.floor(100 + Math.random() * 900)}`;
      const newMsg: LiveChatMessage = {
        id: `msg_sim_${Date.now()}`,
        senderId: `u_${Date.now()}`,
        senderName: randomUser,
        senderAvatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 50)}?auto=format&fit=crop&w=100&q=80`,
        senderLevel: Math.floor(Math.random() * 30) + 1,
        content: randomText,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev.slice(-30), newMsg]);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  // Send Chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: LiveChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderLevel: currentUser.level,
      content: inputText.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  // Burst floating heart reaction
  const triggerHeartReaction = () => {
    setLikes((prev) => prev + 1);
    const newHeart: FloatingReaction = {
      id: Date.now() + Math.random(),
      emoji: ['❤️', '🔥', '💖', '✨', '⚡'][Math.floor(Math.random() * 5)],
      left: 20 + Math.random() * 60,
    };
    setFloatingHearts((prev) => [...prev.slice(-15), newHeart]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 2000);
  };

  // Send Virtual Gift
  const handleSendGift = (gift: VirtualGift) => {
    if (diamonds < gift.costInDiamonds) {
      alert(`Insufficient Diamonds! You need ${gift.costInDiamonds} diamonds. Claim free coins or top up in your wallet.`);
      return;
    }

    const success = onDeductDiamonds(gift.costInDiamonds);
    if (!success) return;

    // Trigger on-screen banner
    setActiveGiftBanner({
      name: gift.name,
      icon: gift.icon,
      sender: currentUser.name,
    });

    // Add gift message to chat
    const giftMsg: LiveChatMessage = {
      id: `gift_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderLevel: currentUser.level,
      content: `sent ${gift.name} ${gift.icon} to Host!`,
      timestamp: 'Just now',
      gift: {
        name: gift.name,
        icon: gift.icon,
        amount: 1,
        diamondValue: gift.costInDiamonds,
      },
    };
    setMessages((prev) => [...prev, giftMsg]);

    // Also trigger floating burst
    triggerHeartReaction();

    setTimeout(() => {
      setActiveGiftBanner(null);
    }, 3500);
  };

  // Interactive Guest Seat handling (8-Seat Audio Adda)
  const handleSeatClick = (seatIdx: number) => {
    if (userSeatIndex === seatIdx) {
      // Leave seat
      setSeats((prev) =>
        prev.map((s) => (s.seatIndex === seatIdx ? { ...s, occupant: null } : s))
      );
      setUserSeatIndex(null);
    } else {
      // Join seat
      setSeats((prev) =>
        prev.map((s) => {
          if (s.seatIndex === seatIdx) {
            return {
              ...s,
              occupant: {
                id: currentUser.id,
                username: currentUser.username,
                name: currentUser.name,
                avatar: currentUser.avatar,
                isMuted: !isMicOn,
                isTalking: true,
                level: currentUser.level,
              },
            };
          }
          if (s.seatIndex === userSeatIndex) {
            return { ...s, occupant: null };
          }
          return s;
        })
      );
      setUserSeatIndex(seatIdx);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const isAudioAdda = room.type === 'audio';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-0 sm:p-4 overflow-hidden animate-in fade-in duration-200">
      {/* Outer Container */}
      <div className="relative w-full h-full sm:h-[94vh] max-w-7xl rounded-none sm:rounded-3xl bg-[#090714] border border-purple-900/30 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Top Floating Header */}
        <div className="h-16 px-4 sm:px-6 bg-[#0c091d]/90 backdrop-blur-md border-b border-purple-900/30 flex items-center justify-between z-20 shrink-0">
          {/* Host Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenProfile(room.host)}
              className="relative group cursor-pointer"
            >
              <img
                src={room.host.avatar}
                alt={room.host.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500 group-hover:ring-cyan-400 transition-all"
              />
              <span className="absolute -bottom-1 -right-1 px-1 rounded-full bg-violet-600 text-[8px] font-bold text-white border border-black">
                {room.host.level}
              </span>
            </button>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base text-white truncate max-w-[140px] sm:max-w-xs">
                  {room.host.name}
                </span>
                {room.host.isVerified && (
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                )}
                <button
                  onClick={() => setIsFollowingHost(!isFollowingHost)}
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                    isFollowingHost
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-xs'
                  }`}
                >
                  {isFollowingHost ? 'Following' : '+ Follow'}
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-purple-300/80">
                <span className="truncate max-w-[150px] sm:max-w-sm">{room.title}</span>
              </div>
            </div>
          </div>

          {/* Viewer & Control Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-purple-500/30 text-xs font-semibold text-slate-200">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <Users className="w-3.5 h-3.5 text-rose-400" />
              <span>{room.viewersCount.toLocaleString()}</span>
            </div>

            <button
              onClick={copyShareLink}
              className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Share Room"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 hover:text-white border border-rose-800/40 transition-colors cursor-pointer"
              title="Close Stream"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body: Stage (Left) & Chat/Gift Panel (Right) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          
          {/* STAGE AREA */}
          <div className="flex-1 relative bg-[#06040d] flex flex-col justify-between overflow-hidden">
            
            {/* Gift Banner Overlay */}
            {activeGiftBanner && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-900/95 via-fuchsia-900/95 to-pink-900/95 border-2 border-cyan-400 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                <span className="text-3xl animate-bounce">{activeGiftBanner.icon}</span>
                <div>
                  <div className="text-xs text-cyan-300 font-bold uppercase tracking-wider">
                    Virtual Gift Sent!
                  </div>
                  <div className="text-sm font-extrabold text-white">
                    {activeGiftBanner.sender} sent <span className="text-gradient">{activeGiftBanner.name}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE DISPLAY: Video Stream OR 8-Seat Audio Adda Stage */}
            <div className="flex-1 flex items-center justify-center p-3 sm:p-6 relative">
              {isAudioAdda ? (
                /* 8-SEAT AUDIO ADDA VOICE STAGE */
                <div className="w-full h-full max-w-4xl flex flex-col items-center justify-center gap-6 sm:gap-8">
                  {/* Central Voice Host Banner */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      {/* Animated Speaking Waves */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-cyan-400 animate-pulse-ring scale-125 opacity-70 pointer-events-none" />
                      <img
                        src={room.host.avatar}
                        alt={room.host.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-cyan-400 shadow-2xl relative z-10"
                      />
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-[10px] font-black text-black shadow-md uppercase">
                        👑 Host
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-3 flex items-center gap-1.5">
                      {room.host.name}
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </h3>
                    <p className="text-xs text-purple-300">
                      Speaking • 8-Seat Audio Adda Room
                    </p>
                  </div>

                  {/* 8 GUEST SEATS GRID (2 rows of 4 seats) */}
                  <div className="w-full grid grid-cols-4 gap-2.5 sm:gap-4 max-w-2xl px-2">
                    {Array.from({ length: 8 }).map((_, seatIdx) => {
                      const seat = seats.find((s) => s.seatIndex === seatIdx);
                      const occupant = seat?.occupant;
                      const isUserHere = userSeatIndex === seatIdx;

                      return (
                        <div
                          key={seatIdx}
                          onClick={() => handleSeatClick(seatIdx)}
                          className={`relative flex flex-col items-center p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer group ${
                            occupant
                              ? 'bg-purple-950/30 border-purple-500/40 hover:border-cyan-400 shadow-lg'
                              : 'bg-slate-900/40 border-slate-800/80 hover:bg-purple-900/20 hover:border-purple-600/50'
                          }`}
                        >
                          <span className="text-[9px] font-semibold text-purple-400/80 absolute top-1.5 left-2">
                            #{seatIdx + 1}
                          </span>

                          {occupant ? (
                            <div className="relative mt-2 mb-1">
                              <img
                                src={occupant.avatar}
                                alt={occupant.name}
                                className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full object-cover ring-2 transition-all ${
                                  occupant.isTalking
                                    ? 'ring-emerald-400 ring-offset-2 ring-offset-black animate-pulse'
                                    : 'ring-purple-500/50'
                                }`}
                              />
                              <span
                                className={`absolute -bottom-1 -right-1 p-1 rounded-full text-white text-[8px] ${
                                  occupant.isMuted ? 'bg-rose-600' : 'bg-emerald-600'
                                }`}
                              >
                                {occupant.isMuted ? (
                                  <MicOff className="w-2.5 h-2.5" />
                                ) : (
                                  <Mic className="w-2.5 h-2.5" />
                                )}
                              </span>
                            </div>
                          ) : (
                            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-slate-900/80 border border-dashed border-slate-700 flex items-center justify-center text-slate-500 group-hover:text-cyan-400 group-hover:border-cyan-400/60 transition-colors mt-2 mb-1">
                              <Mic className="w-4 h-4" />
                            </div>
                          )}

                          <span className="text-[11px] font-semibold text-slate-200 truncate max-w-[70px] text-center">
                            {occupant ? occupant.name.split(' ')[0] : 'Empty'}
                          </span>

                          <span className="text-[9px] text-purple-300">
                            {isUserHere ? (
                              <span className="text-rose-400 font-bold">Leave Mic</span>
                            ) : occupant ? (
                              'On Mic'
                            ) : (
                              '+ Take Seat'
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Seat Mic Instructions */}
                  <div className="text-center text-xs text-purple-300/80 flex items-center justify-center gap-2">
                    <Hand className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Click any empty seat to take the microphone and join the adda live!</span>
                  </div>
                </div>
              ) : (
                /* VIDEO STREAM PLAYER SIMULATION */
                <div className="w-full h-full max-w-4xl rounded-2xl overflow-hidden bg-black border border-purple-900/40 relative shadow-2xl flex items-center justify-center">
                  <img
                    src={room.coverImage}
                    alt={room.title}
                    className="w-full h-full object-cover filter brightness-90"
                  />

                  {/* Video Live Watermark */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
                    <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                    <span>1080p 60FPS LiveKit Stream</span>
                  </div>

                  {/* Center Play indicator overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                </div>
              )}
            </div>

            {/* Bottom Stream Controls Bar */}
            <div className="h-14 px-4 bg-[#0a0817]/95 border-t border-purple-900/30 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setIsAudioMuted(!isAudioMuted)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                  title={isAudioMuted ? 'Unmute Stream' : 'Mute Stream'}
                >
                  {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {userSeatIndex !== null && (
                  <button
                    onClick={() => setIsMicOn(!isMicOn)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isMicOn
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                    <span>{isMicOn ? 'Mic Live' : 'Mic Muted'}</span>
                  </button>
                )}

                <span className="text-xs text-slate-300 hidden sm:inline">
                  {isAudioAdda ? '🎙️ Audio Adda Mode' : '📺 Video Stream'}
                </span>
              </div>

              {/* Heart burst reaction trigger */}
              <div className="flex items-center gap-2 relative">
                <button
                  onClick={triggerHeartReaction}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-600/30 hover:bg-pink-600/50 text-pink-300 border border-pink-500/40 text-xs font-bold transition-all cursor-pointer group"
                >
                  <Heart className="w-4 h-4 fill-pink-500 text-pink-500 group-hover:scale-125 transition-transform" />
                  <span>{likes.toLocaleString()}</span>
                </button>
              </div>
            </div>

            {/* Floating Hearts Animation Container */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
              {floatingHearts.map((heart) => (
                <div
                  key={heart.id}
                  style={{ left: `${heart.left}%` }}
                  className="absolute bottom-16 text-2xl animate-in fade-in slide-in-from-bottom duration-1000 transform -translate-y-48 opacity-0 transition-opacity"
                >
                  {heart.emoji}
                </div>
              ))}
            </div>
          </div>

          {/* CHAT & VIRTUAL GIFT COLUMN (Right side on desktop, stacked on mobile) */}
          <div className="w-full lg:w-96 h-72 lg:h-auto bg-[#0b0818] border-t lg:border-t-0 lg:border-l border-purple-900/30 flex flex-col justify-between shrink-0">
            
            {/* Chat Header */}
            <div className="p-3 border-b border-purple-900/20 flex items-center justify-between text-xs font-bold text-white bg-slate-950/40">
              <span className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-purple-400" />
                Live Chat
              </span>
              <span className="text-[11px] text-cyan-300 font-semibold">
                💎 {diamonds.toLocaleString()}
              </span>
            </div>

            {/* Messages Scrollable Feed */}
            <div
              ref={chatScrollRef}
              className="flex-1 p-3 space-y-2.5 overflow-y-auto no-scrollbar text-xs"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded-xl transition-all ${
                    msg.gift
                      ? 'bg-gradient-to-r from-purple-950/80 to-pink-950/70 border border-purple-600/40'
                      : 'bg-slate-900/40 hover:bg-slate-900/70 border border-purple-950/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-4 h-4 rounded-full object-cover shrink-0"
                      />
                      <span className="font-bold text-slate-200 truncate">
                        {msg.senderName}
                      </span>
                      <span className="text-[9px] px-1 rounded bg-purple-900/80 text-purple-200 font-bold shrink-0">
                        Lv.{msg.senderLevel}
                      </span>
                      {msg.isModerator && (
                        <span className="text-[8px] px-1 rounded bg-cyan-900 text-cyan-200 font-bold">
                          MOD
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-300 shrink-0">
                      {msg.timestamp}
                    </span>
                  </div>

                  <div className="mt-1 text-slate-100 pl-5.5 leading-relaxed break-words">
                    {msg.gift && (
                      <span className="inline-flex items-center gap-1 font-bold text-pink-300 mr-1.5">
                        {msg.gift.icon} {msg.gift.name}
                      </span>
                    )}
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Gift Tray Drawer Overlay */}
            {showGiftTray && (
              <div className="p-3 bg-[#130d2a] border-t border-purple-800/40 animate-in slide-in-from-bottom duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-cyan-400" /> Virtual Gift Tray
                  </span>
                  <button
                    onClick={() => setShowGiftTray(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {VIRTUAL_GIFTS.map((gift) => (
                    <button
                      key={gift.id}
                      onClick={() => handleSendGift(gift)}
                      className="flex flex-col items-center p-2 rounded-xl bg-slate-900/80 hover:bg-purple-900/40 border border-purple-900/30 hover:border-pink-500 transition-all cursor-pointer group"
                    >
                      <span className="text-2xl group-hover:scale-125 transition-transform">
                        {gift.icon}
                      </span>
                      <span className="text-[10px] font-bold text-white mt-1 truncate max-w-full">
                        {gift.name}
                      </span>
                      <span className="text-[9px] font-semibold text-cyan-300 flex items-center gap-0.5">
                        💎 {gift.costInDiamonds}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 bg-[#0d091e] border-t border-purple-900/30">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowGiftTray(!showGiftTray)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    showGiftTray
                      ? 'bg-pink-600 text-white border-pink-400 shadow-md shadow-pink-600/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-pink-400 border-purple-900/40'
                  }`}
                  title="Virtual Gifts"
                >
                  <Gift className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Say something in Adda..."
                  className="flex-1 h-9 px-3 rounded-xl bg-slate-900/90 border border-purple-900/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-violet-500 hover:to-cyan-400 transition-all cursor-pointer shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
