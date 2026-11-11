import React, { useState, useMemo } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { FeaturedHero } from './components/home/FeaturedHero';
import { CategorySlider } from './components/home/CategorySlider';
import { StreamCard } from './components/home/StreamCard';
import { RecommendedStreamers } from './components/home/RecommendedStreamers';
import { QuickDashboard } from './components/home/QuickDashboard';
import { LiveRoomViewerModal } from './components/modals/LiveRoomViewerModal';
import { GoLiveModal } from './components/modals/GoLiveModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { WalletModal } from './components/modals/WalletModal';
import { LoginPage } from './components/LoginPage';

import { CATEGORIES, MOCK_ROOMS, MOCK_STREAMERS } from './data/mockData';
import { CategoryId, LiveRoom, StreamerProfile } from './types';
import { Radio, Search, Sparkles, Filter, RefreshCw, Database } from 'lucide-react';

export default function App() {
  // Current user state (Creator/Viewer session)
  const [currentUser, setCurrentUser] = useState<StreamerProfile>({
    id: 'user_me',
    name: 'Tanvir Hossain',
    username: 'tanvir_live',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    bio: 'AddaBuzz Creator & Community Host 🎙️ Love meeting new people in 8-seat audio rooms!',
    country: 'Bangladesh',
    gender: 'male',
    followersCount: 3420,
    followingCount: 88,
    level: 28,
    isVerified: true,
    isLive: false,
    totalGiftsReceived: 8900,
    tags: ['Adda', 'ChitChat', 'Music'],
  });

  const [diamonds, setDiamonds] = useState(1450);
  const [coins, setCoins] = useState(2000);
  const [dailyClaimed, setDailyClaimed] = useState(false);

  // Discovery & Navigation State
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState<LiveRoom[]>(MOCK_ROOMS);
  const [streamers, setStreamers] = useState<StreamerProfile[]>(MOCK_STREAMERS);

  // Modals & Drawers
  const [activeRoom, setActiveRoom] = useState<LiveRoom | null>(null);
  const [activeProfile, setActiveProfile] = useState<StreamerProfile | null>(null);
  const [isGoLiveOpen, setIsGoLiveOpen] = useState(false);
  const [goLiveInitialMode, setGoLiveInitialMode] = useState<'video' | 'audio'>('audio');
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Toggle Follow / Unfollow
  const handleToggleFollow = (streamerId: string) => {
    setStreamers((prev) =>
      prev.map((s) =>
        s.id === streamerId
          ? {
              ...s,
              isFollowed: !s.isFollowed,
              followersCount: s.isFollowed ? s.followersCount - 1 : s.followersCount + 1,
            }
          : s
      )
    );

    // Also update if host in any room
    setRooms((prev) =>
      prev.map((r) =>
        r.host.id === streamerId
          ? {
              ...r,
              host: {
                ...r.host,
                isFollowed: !r.host.isFollowed,
              },
            }
          : r
      )
    );
  };

  // Claim Daily Free Activity Coins
  const handleClaimDailyCoins = () => {
    if (dailyClaimed) return;
    setCoins((prev) => prev + 50);
    setDailyClaimed(true);
  };

  const handleDeductCoins = (amount: number): boolean => {
    if (coins < amount) return false;
    setCoins((prev) => prev - amount);
    return true;
  };

  // Add bonus test diamonds
  const handleAddDiamondsBonus = (amount: number) => {
    setDiamonds((prev) => prev + amount);
  };

  // Start new room from GoLiveModal
  const handleStartRoom = (newRoom: LiveRoom) => {
    setRooms((prev) => [newRoom, ...prev]);
    setActiveRoom(newRoom);
  };

  // Open Go Live with preset mode
  const handleOpenGoLiveWithMode = (mode: 'video' | 'audio' = 'audio') => {
    setGoLiveInitialMode(mode);
    setIsGoLiveOpen(true);
  };

  // Filtered rooms based on Category and Search Query
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Category filter
      if (activeCategory !== 'all' && room.category !== activeCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = room.title.toLowerCase().includes(query);
        const matchesHost = room.host.name.toLowerCase().includes(query) || room.host.username.toLowerCase().includes(query);
        const matchesTags = room.tags.some((t) => t.toLowerCase().includes(query));
        const matchesCategory = room.category.toLowerCase().includes(query);
        return matchesTitle || matchesHost || matchesTags || matchesCategory;
      }
      return true;
    });
  }, [rooms, activeCategory, searchQuery]);

  // Featured rooms for hero carousel
  const featuredRooms = useMemo(() => {
    const featured = rooms.filter((r) => r.isFeatured);
    return featured.length > 0 ? featured : rooms.slice(0, 2);
  }, [rooms]);

  // Followed streamers for sidebar
  const followedStreamers = useMemo(() => {
    return streamers.filter((s) => s.isFollowed);
  }, [streamers]);

  if (!isLoggedIn) {
    return <LoginPage onAuthenticated={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#07070D] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-purple-600 selection:text-white">
      {/* Universal Top Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenGoLive={() => handleOpenGoLiveWithMode('audio')}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenProfile={(profile) => setActiveProfile(profile)}
        currentUser={currentUser}
        diamonds={diamonds}
      />

      {/* Main Body with Desktop Sidebar + Content Area */}
      <div className="flex-1 flex max-w-[1920px] w-full mx-auto">
        {/* Left Desktop Sidebar */}
        <Sidebar
          activeCategory={activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat)}
          followedStreamers={followedStreamers}
          onOpenRoom={(room) => setActiveRoom(room)}
          onOpenProfile={(profile) => setActiveProfile(profile)}
          allRooms={rooms}
          onToggleDashboard={() => setIsDashboardOpen(!isDashboardOpen)}
          isDashboardOpen={isDashboardOpen}
        />

        {/* Central Content Canvas */}
        <main className="flex-1 min-w-0 p-3 sm:p-6 md:p-8 pb-24 lg:pb-12 overflow-y-auto">
          {/* Quick Access Dashboard (toggled via sidebar button or auto displayed) */}
          {isDashboardOpen && (
            <QuickDashboard
              currentUser={currentUser}
              diamonds={diamonds}
              coins={coins}
              onOpenGoLive={handleOpenGoLiveWithMode}
              onOpenWallet={() => setIsWalletOpen(true)}
              onClaimDailyCoins={handleClaimDailyCoins}
              dailyClaimed={dailyClaimed}
              onClose={() => setIsDashboardOpen(false)}
            />
          )}

          {/* Featured Hero Showcase (shown on 'all' category when no search query active) */}
          {activeCategory === 'all' && !searchQuery.trim() && (
            <FeaturedHero
              featuredRooms={featuredRooms}
              onOpenRoom={(room) => setActiveRoom(room)}
              onOpenProfile={(profile) => setActiveProfile(profile)}
            />
          )}

          {/* Category Slider Chips */}
          <CategorySlider
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onSelectCategory={(id) => setActiveCategory(id)}
          />

          {/* Live Streams Section Header */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                {activeCategory === 'all'
                  ? 'Active Live Broadcasts & Addas'
                  : CATEGORIES.find((c) => c.id === activeCategory)?.name || 'Live Rooms'}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/40">
                {filteredRooms.length} online
              </span>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-purple-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Clear search
              </button>
            )}
          </div>

          {/* Stream Cards Grid */}
          {filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredRooms.map((room) => (
                <StreamCard
                  key={room.id}
                  room={room}
                  onOpenRoom={(r) => setActiveRoom(r)}
                  onOpenProfile={(p) => setActiveProfile(p)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-slate-900/40 border border-purple-900/30 my-6">
              <Search className="w-12 h-12 text-purple-400/60 mb-3" />
              <h3 className="text-base font-bold text-white">No live streams found</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                We couldn't find any active rooms matching "{searchQuery}". Try selecting another category or be the first to go live!
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Popular Streamers & Creators Section */}
          <RecommendedStreamers
            streamers={streamers}
            onOpenProfile={(profile) => setActiveProfile(profile)}
            onToggleFollow={handleToggleFollow}
            allRooms={rooms}
            onOpenRoom={(room) => setActiveRoom(room)}
          />

        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        onOpenGoLive={() => handleOpenGoLiveWithMode('audio')}
        onOpenProfile={(profile) => setActiveProfile(profile)}
        currentUser={currentUser}
      />

      {/* Interactive Modals */}
      {activeRoom && (
        <LiveRoomViewerModal
          room={activeRoom}
          onClose={() => setActiveRoom(null)}
          onOpenProfile={(profile) => setActiveProfile(profile)}
          currentUser={currentUser}
          coins={coins}
          onDeductCoins={handleDeductCoins}
        />
      )}

      {isGoLiveOpen && (
        <GoLiveModal
          isOpen={isGoLiveOpen}
          onClose={() => setIsGoLiveOpen(false)}
          currentUser={currentUser}
          onStartRoom={handleStartRoom}
          initialMode={goLiveInitialMode}
        />
      )}

      {activeProfile && (
        <ProfileModal
          profile={activeProfile}
          onClose={() => setActiveProfile(null)}
          onToggleFollow={handleToggleFollow}
          allRooms={rooms}
          onOpenRoom={(room) => setActiveRoom(room)}
        />
      )}

      {isWalletOpen && (
        <WalletModal
          isOpen={isWalletOpen}
          onClose={() => setIsWalletOpen(false)}
          diamonds={diamonds}
          coins={coins}
          onClaimDailyCoins={handleClaimDailyCoins}
          dailyClaimed={dailyClaimed}
          onAddDiamondsBonus={handleAddDiamondsBonus}
        />
      )}

    </div>
  );
}
