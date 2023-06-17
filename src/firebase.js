import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY_DEV,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN_DEV,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID_DEV,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET_DEV,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID_DEV,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID_DEV,
  measurementId: import.meta.env.VITE_APP_MEASUREMENT_ID_DEV
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);