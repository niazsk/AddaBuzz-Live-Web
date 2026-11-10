-- ====================================================================
-- ADDABUZZ LIVE — MASTER DATABASE SCHEMA & MIGRATION (SUPABASE POSTGRESQL)
-- Strict Free-Technology Policy • UUIDs • RLS Security Policies • Indexes
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 2. ENUM TYPES
-- ====================================================================
DO $$ BEGIN
  CREATE TYPE user_gender AS ENUM ('male', 'female', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE room_type AS ENUM ('video', 'audio');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE room_status AS ENUM ('active', 'ended', 'suspended');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE gift_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'dismissed', 'actioned');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ====================================================================
-- 3. PROFILES TABLE (Linked with auth.users)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(40) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  cover_url TEXT DEFAULT 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
  bio TEXT DEFAULT 'Welcome to my AddaBuzz Live profile! 🎙️',
  country VARCHAR(60) DEFAULT 'Bangladesh',
  gender user_gender DEFAULT 'male',
  level INT DEFAULT 1,
  is_verified BOOLEAN DEFAULT false,
  is_banned BOOLEAN DEFAULT false,
  followers_count INT DEFAULT 0,
  following_count INT DEFAULT 0,
  total_gifts_received BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_level ON public.profiles(level);

-- ====================================================================
-- 4. USER SETTINGS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  allow_guest_invites BOOLEAN DEFAULT true,
  notify_followed_live BOOLEAN DEFAULT true,
  notify_messages BOOLEAN DEFAULT true,
  preferred_language VARCHAR(10) DEFAULT 'bn',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 5. USER FOLLOWS & BLOCKS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON public.user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON public.user_follows(following_id);

CREATE TABLE IF NOT EXISTS public.user_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);

-- ====================================================================
-- 6. LIVE ROOMS & 8-SEAT GUEST STRUCTURE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.live_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  room_type room_type DEFAULT 'audio',
  category VARCHAR(50) DEFAULT 'audio_adda',
  status room_status DEFAULT 'active',
  cover_url TEXT,
  viewers_count INT DEFAULT 1,
  likes_count INT DEFAULT 0,
  max_seats INT DEFAULT 8,
  is_multi_guest BOOLEAN DEFAULT true,
  livekit_room_name VARCHAR(100) UNIQUE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_live_rooms_status ON public.live_rooms(status);
CREATE INDEX IF NOT EXISTS idx_live_rooms_category ON public.live_rooms(category);
CREATE INDEX IF NOT EXISTS idx_live_rooms_host ON public.live_rooms(host_id);

-- 8 Guest Seats
CREATE TABLE IF NOT EXISTS public.live_seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.live_rooms(id) ON DELETE CASCADE,
  seat_index INT NOT NULL CHECK (seat_index >= 0 AND seat_index < 8),
  occupant_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_locked BOOLEAN DEFAULT false,
  is_muted BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ,
  UNIQUE(room_id, seat_index)
);

CREATE INDEX IF NOT EXISTS idx_live_seats_room ON public.live_seats(room_id);

-- Join Requests for guest seats
CREATE TABLE IF NOT EXISTS public.live_join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.live_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seat_index INT,
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- Participants history
CREATE TABLE IF NOT EXISTS public.live_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.live_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  role VARCHAR(20) DEFAULT 'viewer' -- viewer, guest, moderator, host
);

-- Realtime Messages in Live Room
CREATE TABLE IF NOT EXISTS public.live_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.live_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_gift_notification BOOLEAN DEFAULT false,
  gift_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_live_messages_room ON public.live_messages(room_id, created_at DESC);

-- Room Moderators
CREATE TABLE IF NOT EXISTS public.room_moderators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.live_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- ====================================================================
-- 7. NOTIFICATIONS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'system',
  is_read BOOLEAN DEFAULT false,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- ====================================================================
-- 8. PRIVATE DIRECT MESSAGING
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversation_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.private_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_private_messages_conv ON public.private_messages(conversation_id, created_at DESC);

-- ====================================================================
-- 9. WALLETS, LEDGER & VIRTUAL GIFTS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.gift_catalog (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  bangla_name VARCHAR(100),
  icon VARCHAR(10) NOT NULL,
  cost_in_diamonds INT NOT NULL CHECK (cost_in_diamonds > 0),
  rarity gift_rarity DEFAULT 'common',
  animation_type VARCHAR(30) DEFAULT 'pop',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default Free-First Gift Catalog
INSERT INTO public.gift_catalog (id, name, bangla_name, icon, cost_in_diamonds, rarity, animation_type)
VALUES
  ('gift_rose', 'Red Rose', 'লাল গোলাপ', '🌹', 5, 'common', 'pop'),
  ('gift_chai', 'Adda Special Cha', 'আড্ডা স্পেশাল চা', '☕', 10, 'common', 'pop'),
  ('gift_buzz', 'Electric Buzz Soda', 'ইলেকট্রিক বাজ', '⚡', 25, 'rare', 'sparkle'),
  ('gift_mic', 'Golden Mic', 'গোল্ডেন মাইক', '🎙️', 99, 'rare', 'sparkle'),
  ('gift_guitar', 'Neon Guitar', 'নিওন গিটার', '🎸', 299, 'epic', 'float'),
  ('gift_tiara', 'Diamond Tiara', 'ডায়মন্ড ক্রাউন', '👑', 599, 'epic', 'float'),
  ('gift_rocket', 'Cosmic Rocket', 'কসমিক রকেট', '🚀', 999, 'legendary', 'blast'),
  ('gift_dragon', 'Cyber Buzz Dragon', 'সাইবার ড্রাগন', '🐉', 2499, 'legendary', 'blast')
ON CONFLICT (id) DO NOTHING;

-- User Wallets (Strict server-side ledger)
CREATE TABLE IF NOT EXISTS public.wallets (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  diamonds_balance BIGINT DEFAULT 100 CHECK (diamonds_balance >= 0),
  coins_balance BIGINT DEFAULT 200 CHECK (coins_balance >= 0),
  last_daily_bonus_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallet Ledger Transactions
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  currency_type VARCHAR(20) NOT NULL, -- 'diamonds' or 'coins'
  amount BIGINT NOT NULL,             -- positive for credit, negative for debit
  balance_after BIGINT NOT NULL,
  reason VARCHAR(100) NOT NULL,       -- 'daily_bonus', 'gift_sent', 'gift_received', 'top_up'
  reference_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wallet_tx_user ON public.wallet_transactions(user_id, created_at DESC);

-- Gift Transactions
CREATE TABLE IF NOT EXISTS public.gift_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.live_rooms(id) ON DELETE SET NULL,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  gift_id VARCHAR(50) NOT NULL REFERENCES public.gift_catalog(id),
  quantity INT DEFAULT 1,
  total_diamonds INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gift_tx_receiver ON public.gift_transactions(receiver_id);

-- ====================================================================
-- 10. MODERATION, REPORTS & AUDIT LOGS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reported_room_id UUID REFERENCES public.live_rooms(id) ON DELETE SET NULL,
  reason VARCHAR(100) NOT NULL,
  description TEXT,
  status report_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view, only owner can update
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Live Rooms: Anyone can view active rooms, authenticated users can create
CREATE POLICY "Live rooms viewable by everyone" ON public.live_rooms FOR SELECT USING (true);
CREATE POLICY "Hosts can create rooms" ON public.live_rooms FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Hosts can update own room" ON public.live_rooms FOR UPDATE USING (auth.uid() = host_id);

-- Live Seats: Everyone can view, occupants/hosts can update
CREATE POLICY "Seats viewable by everyone" ON public.live_seats FOR SELECT USING (true);

-- Live Messages: Everyone in room can view, authenticated can send
CREATE POLICY "Messages viewable by everyone" ON public.live_messages FOR SELECT USING (true);
CREATE POLICY "Users can insert messages" ON public.live_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Wallets: Only owner can view
CREATE POLICY "Users can view own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);

-- Gift Catalog: Viewable by everyone
CREATE POLICY "Gift catalog viewable by everyone" ON public.gift_catalog FOR SELECT USING (true);

-- Auto create profile on auth signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, name, avatar_url, gender)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || SUBSTRING(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'name', 'Adda Creator'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'),
    'male'
  );

  INSERT INTO public.wallets (user_id, diamonds_balance, coins_balance)
  VALUES (NEW.id, 100, 200);

  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition for auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
