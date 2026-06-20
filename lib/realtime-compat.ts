"use client";

import {
  onValue,
  push,
  ref,
  remove,
  serverTimestamp as realtimeServerTimestamp,
  update,
  type Database,
} from "firebase/database";

type CollectionRef = { database: Database; path: string };
type DocumentRef = CollectionRef & { id: string };

export function collection(database: Database, path: string): CollectionRef {
  return { database, path };
}

export function doc(database: Database, collectionPath: string, id: string): DocumentRef {
  return { database, path: collectionPath, id };
}

export async function addDoc(collectionRef: CollectionRef, value: Record<string, unknown>) {
  return push(ref(collectionRef.database, collectionRef.path), value);
}

export async function updateDoc(documentRef: DocumentRef, value: Record<string, unknown>) {
  return update(ref(documentRef.database, `${documentRef.path}/${documentRef.id}`), value);
}

export async function deleteDoc(documentRef: DocumentRef) {
  return remove(ref(documentRef.database, `${documentRef.path}/${documentRef.id}`));
}

export function serverTimestamp() {
  return realtimeServerTimestamp();
}

export function onSnapshot(
  collectionRef: CollectionRef,
  onNext: (snapshot: { docs: { id: string; data: () => Record<string, unknown> }[] }) => void,
  onError: (error: Error) => void,
) {
  return onValue(ref(collectionRef.database, collectionRef.path), (snapshot) => {
    const entries = Object.entries(snapshot.val() ?? {}).map(([id, data]) => ({
      id,
      data: () => data as Record<string, unknown>,
    }));
    onNext({ docs: entries });
  }, onError);
}
