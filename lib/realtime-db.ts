type JsonRecord = Record<string, unknown>;

const databaseUrl = (
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ??
  "https://auto-pulse-india-2-default-rtdb.firebaseio.com"
).replace(/\/$/, "");

function endpoint(path: string) {
  const cleanPath = path.replace(/^\/+|\/+$/g, "");
  return `${databaseUrl}/${cleanPath}.json`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(endpoint(path), {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Realtime Database request failed (${response.status}).`);
  }

  return (await response.json()) as T;
}

export async function readRecord<T>(path: string): Promise<T | null> {
  return request<T | null>(path);
}

export async function writeRecord(path: string, value: JsonRecord): Promise<void> {
  await request(path, { method: "PUT", body: JSON.stringify(value) });
}

export async function pushRecord(path: string, value: JsonRecord): Promise<string> {
  const result = await request<{ name: string }>(path, {
    method: "POST",
    body: JSON.stringify(value),
  });
  return result.name;
}

export function emailKey(email: string) {
  return Buffer.from(email).toString("base64url");
}

export function values<T>(record: Record<string, T> | null): T[] {
  return Object.values(record ?? {});
}
