import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// আপনার .env.local ফাইল থেকে সিক্রেট কি-গুলো এখানে রিড হবে
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Next.js-এর সার্ভার-সাইড ডুপ্লিকেশন এড়াতে এই কন্ডিশনটি দেওয়া
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// পুরো প্রোজেক্টে ব্যবহার করার জন্য ফায়ারস্টোর ডেটাবেস এক্সপোর্ট করা হলো
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
