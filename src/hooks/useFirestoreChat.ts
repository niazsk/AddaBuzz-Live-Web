import { useEffect, useState, useCallback } from 'react';
import { firebaseDb } from '../lib/firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

export interface FirestoreChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  isGiftNotification?: boolean;
  giftData?: any;
  createdAt: Timestamp | null;
}

export function useFirestoreChat(roomId: string, senderId: string, senderName: string) {
  const [messages, setMessages] = useState<FirestoreChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;
    const q = query(
      collection(firebaseDb, 'live_rooms', roomId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(100)
    );
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as FirestoreChatMessage[];
      setMessages(msgs);
      setLoading(false);
    });
    return () => unsub();
  }, [roomId]);

  const sendMessage = useCallback(
    async (content: string, extra?: { isGiftNotification?: boolean; giftData?: any }) => {
      if (!content.trim()) return;
      await addDoc(collection(firebaseDb, 'live_rooms', roomId, 'messages'), {
        roomId,
        senderId,
        senderName,
        content,
        isGiftNotification: extra?.isGiftNotification ?? false,
        giftData: extra?.giftData ?? null,
        createdAt: serverTimestamp(),
      });
    },
    [roomId, senderId, senderName]
  );

  return { messages, loading, sendMessage };
}
