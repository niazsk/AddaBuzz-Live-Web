export type StreamType = 'video' | 'audio';

export type CategoryId = 
  | 'all'
  | 'audio_adda'
  | 'gaming'
  | 'music'
  | 'casual'
  | 'tech'
  | 'creative'
  | 'pk_battle';

export interface Category {
  id: CategoryId;
  name: string;
  banglaName?: string;
  iconName: string;
  count: number;
  description: string;
  color: string;
}

export interface GuestSeat {
  seatIndex: number; // 0 to 7 (8 seats total)
  isLocked: boolean;
  occupant?: {
    id: string;
    username: string;
    name: string;
    avatar: string;
    isMuted: boolean;
    isTalking: boolean;
    level: number;
  } | null;
}

export interface StreamerProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  coverPhoto: string;
  bio: string;
  country: string;
  gender: 'male' | 'female' | 'other';
  followersCount: number;
  followingCount: number;
  level: number;
  isVerified: boolean;
  isLive: boolean;
  currentRoomId?: string;
  totalGiftsReceived: number;
  diamonds?: number;
  coins?: number;
  isFollowed?: boolean;
  tags: string[];
}

export interface LiveRoom {
  id: string;
  title: string;
  host: StreamerProfile;
  type: StreamType;
  category: CategoryId;
  viewersCount: number;
  startedAt: string;
  coverImage: string;
  videoPreviewUrl?: string; // fallback / preview stream video or animated canvas
  tags: string[];
  likesCount: number;
  isMultiGuest: boolean;
  maxSeats: number; // default 8
  seats: GuestSeat[];
  isFeatured?: boolean;
  isPinned?: boolean;
}

export interface VirtualGift {
  id: string;
  name: string;
  banglaName?: string;
  icon: string;
  costInCoins: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  animationType: 'pop' | 'sparkle' | 'float' | 'blast';
}

export interface LiveChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderLevel: number;
  isHost?: boolean;
  isGuest?: boolean;
  isModerator?: boolean;
  content: string;
  timestamp: string;
  gift?: {
    name: string;
    icon: string;
    amount: number;
    diamondValue: number;
  };
}

export interface WalletLedger {
  diamonds: number; // premium currency received/purchased
  coins: number;    // free activity reward currency
  dailyBonusClaimed: boolean;
  levelProgress: number; // 0-100
}

export interface QuickAccessStats {
  liveFollowedCount: number;
  unreadMessagesCount: number;
  pendingJoinRequests: number;
  walletBalance: number;
}
