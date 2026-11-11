import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBzTMucFHSRE7wXm6CXuBD-YuBR9sKOaXY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'addabuzzlive.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'addabuzzlive',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'addabuzzlive.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1002525460523',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1002525460523:web:b3cc7b68c922b4409dc26e',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-VZHTQFVNEQ',
};

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const firebaseDb = getFirestore(app);
export const firebaseStorage = getStorage(app);
export default app;
