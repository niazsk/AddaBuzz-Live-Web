import { Room, RoomConnectOptions, RoomOptions, createLocalAudioTrack, createLocalVideoTrack, LocalTrack } from 'livekit-client';

const STORAGE_KEY_URL = 'addabuzz_livekit_url';
const STORAGE_KEY_TOKEN = 'addabuzz_livekit_token';

export interface LiveKitConfig {
  url: string;
  token: string;
  isCustom: boolean;
}

export function getLiveKitConfig(): LiveKitConfig {
  const envUrl = import.meta.env.VITE_LIVEKIT_URL;
  const envToken = import.meta.env.VITE_LIVEKIT_TOKEN;

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) : null;
  const localToken = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_TOKEN) : null;

  const url = localUrl || (envUrl && envUrl !== 'wss://your-livekit-server' ? envUrl : '');
  const token = localToken || (envToken && envToken !== 'your-access-token' ? envToken : '');

  return {
    url: url || '',
    token: token || '',
    isCustom: Boolean(localUrl || localToken),
  };
}

export function isLiveKitConfigured(): boolean {
  const config = getLiveKitConfig();
  return Boolean(config.url && config.token && config.url.startsWith('wss://'));
}

export function saveLiveKitConfig(url: string, token: string): boolean {
  if (typeof window === 'undefined') return false;
  if (!url || !token) {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    return false;
  }
  localStorage.setItem(STORAGE_KEY_URL, url.trim());
  localStorage.setItem(STORAGE_KEY_TOKEN, token.trim());
  return true;
}

export function clearLiveKitConfig(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_URL);
  localStorage.removeItem(STORAGE_KEY_TOKEN);
}

let cachedRoom: Room | null = null;

export function getLiveKitRoom(options?: RoomOptions): Room {
  if (cachedRoom) return cachedRoom;
  cachedRoom = new Room(options);
  return cachedRoom;
}

export async function connectToLiveKit(
  url?: string,
  token?: string,
  options?: RoomConnectOptions
): Promise<Room> {
  const config = getLiveKitConfig();
  const targetUrl = url || config.url;
  const targetToken = token || config.token;

  if (!targetUrl || !targetToken) {
    throw new Error('LiveKit URL and access token are required.');
  }

  const room = getLiveKitRoom();
  await room.connect(targetUrl, targetToken, options);
  return room;
}

export async function disconnectFromLiveKit(): Promise<void> {
  if (cachedRoom) {
    await cachedRoom.disconnect();
    cachedRoom = null;
  }
}

export async function createLocalTracks(): Promise<LocalTrack[]> {
  const tracks: LocalTrack[] = [];
  try {
    const audioTrack = await createLocalAudioTrack();
    tracks.push(audioTrack);
  } catch (err) {
    console.warn('Failed to create local audio track:', err);
  }
  try {
    const videoTrack = await createLocalVideoTrack();
    tracks.push(videoTrack);
  } catch (err) {
    console.warn('Failed to create local video track:', err);
  }
  return tracks;
}

export async function testLiveKitConnection(
  url?: string,
  token?: string
): Promise<{ success: boolean; message: string; details?: any }> {
  const targetUrl = url || getLiveKitConfig().url;
  const targetToken = token || getLiveKitConfig().token;

  if (!targetUrl || !targetToken) {
    return { success: false, message: 'LiveKit URL and access token are missing.' };
  }

  try {
    const room = new Room();
    await room.connect(targetUrl, targetToken);
    const info = {
      roomName: room.name,
      numParticipants: room.numParticipants,
      localParticipant: room.localParticipant.identity,
    };
    await room.disconnect();
    return { success: true, message: 'Successfully connected to LiveKit server!', details: info };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to connect to LiveKit.', details: err };
  }
}
