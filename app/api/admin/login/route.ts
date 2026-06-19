import { timingSafeEqual } from "node:crypto";

type LoginBody = {
  userId?: string;
  password?: string;
};

function matches(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);
  return (
    valueBuffer.length === expectedBuffer.length &&
    timingSafeEqual(valueBuffer, expectedBuffer)
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;
    const userId = body.userId?.trim() ?? "";
    const password = body.password ?? "";
    const expectedUserId = process.env.ADMIN_USER_ID ?? "";
    const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
    const firebaseEmail = process.env.NEXT_PUBLIC_ADMIN_FIREBASE_EMAIL ?? "";

    if (!expectedUserId || !expectedPassword || !firebaseEmail) {
      return Response.json(
        { error: "Fixed admin credentials are not configured." },
        { status: 503 },
      );
    }

    if (
      !matches(userId, expectedUserId) ||
      !matches(password, expectedPassword)
    ) {
      return Response.json(
        { error: "Invalid admin ID or password." },
        { status: 401 },
      );
    }

    return Response.json({ firebaseEmail });
  } catch {
    return Response.json({ error: "Invalid login request." }, { status: 400 });
  }
}
