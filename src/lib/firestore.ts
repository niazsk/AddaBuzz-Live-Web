import { firebaseDb } from './firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

export const collections = {
  profiles: collection(firebaseDb, 'profiles'),
  rooms: collection(firebaseDb, 'live_rooms'),
  messages: collection(firebaseDb, 'live_messages'),
  gifts: collection(firebaseDb, 'gift_catalog'),
  wallets: collection(firebaseDb, 'wallets'),
};

export async function seedGiftCatalog() {
  const gifts = [
    { id: 'gift_rose', name: 'Red Rose', banglaName: 'লাল গোলাপ', icon: '🌹', costInCoins: 5, rarity: 'common' },
    { id: 'gift_chai', name: 'Adda Special Cha', banglaName: 'আড্ডা স্পেশাল চা', icon: '☕', costInCoins: 10, rarity: 'common' },
    { id: 'gift_buzz', name: 'Electric Buzz Soda', banglaName: 'ইলেকট্রিক বাজ', icon: '⚡', costInCoins: 25, rarity: 'rare' },
    { id: 'gift_mic', name: 'Golden Mic', banglaName: 'গোল্ডেন মাইক', icon: '🎙️', costInCoins: 99, rarity: 'rare' },
    { id: 'gift_guitar', name: 'Neon Guitar', banglaName: 'নিওন গিটার', icon: '🎸', costInCoins: 299, rarity: 'epic' },
    { id: 'gift_tiara', name: 'Diamond Tiara', banglaName: 'ডায়মন্ড ক্রাউন', icon: '👑', costInCoins: 599, rarity: 'epic' },
    { id: 'gift_rocket', name: 'Cosmic Rocket', banglaName: 'কসমিক রকেট', icon: '🚀', costInCoins: 999, rarity: 'legendary' },
    { id: 'gift_dragon', name: 'Cyber Buzz Dragon', banglaName: 'সাইবার ড্রাগন', icon: '🐉', costInCoins: 2499, rarity: 'legendary' },
  ];
  for (const g of gifts) {
    await setDoc(doc(firebaseDb, 'gift_catalog', g.id), { ...g, isActive: true, createdAt: serverTimestamp() });
  }
  return gifts.length;
}

export async function createProfile(uid: string, data: Record<string, any>) {
  await setDoc(doc(firebaseDb, 'profiles', uid), {
    ...data,
    diamonds: 100,
    coins: 200,
    followersCount: 0,
    followingCount: 0,
    totalGiftsReceived: 0,
    level: 1,
    isVerified: false,
    isBanned: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function listCollection(name: string) {
  const snap = await getDocs(collection(firebaseDb, name));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
