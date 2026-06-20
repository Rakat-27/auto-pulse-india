import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const databaseURL =
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ??
  "https://auto-pulse-india-2-default-rtdb.firebaseio.com";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Admin pages use the browser SDK so Firebase Authentication is evaluated by
// Realtime Database rules. Public forms go through server-side route handlers.
export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
