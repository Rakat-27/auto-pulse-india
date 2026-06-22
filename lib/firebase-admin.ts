import "server-only";

import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getDatabase, type Database } from "firebase-admin/database";

const databaseURL = (
  process.env.FIREBASE_DATABASE_URL ??
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ??
  "https://auto-pulse-india-2-default-rtdb.firebaseio.com"
).replace(/\/$/, "");

function getServiceAccount(): ServiceAccount {
  const value = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!value) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not configured.");
  }

  try {
    return JSON.parse(value) as ServiceAccount;
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY must contain valid JSON.");
  }
}

let database: Database | undefined;

export function getAdminDatabase() {
  if (database) return database;

  const app =
    getApps()[0] ??
    initializeApp({
      credential: cert(getServiceAccount()),
      databaseURL,
    });

  database = getDatabase(app);
  return database;
}
