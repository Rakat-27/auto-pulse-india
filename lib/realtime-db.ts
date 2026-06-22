import "server-only";

import { getAdminDatabase } from "@/lib/firebase-admin";

type JsonRecord = Record<string, unknown>;

export async function readRecord<T>(path: string): Promise<T | null> {
  const snapshot = await getAdminDatabase().ref(path).get();
  return snapshot.exists() ? (snapshot.val() as T) : null;
}

export async function writeRecord(path: string, value: JsonRecord): Promise<void> {
  await getAdminDatabase().ref(path).set(value);
}

export async function pushRecord(path: string, value: JsonRecord): Promise<string> {
  const record = await getAdminDatabase().ref(path).push(value);
  return record.key ?? "";
}

export function emailKey(email: string) {
  return Buffer.from(email).toString("base64url");
}

export function values<T>(record: Record<string, T> | null): T[] {
  return Object.values(record ?? {});
}
