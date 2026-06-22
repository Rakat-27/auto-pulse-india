import { timingSafeEqual } from "node:crypto";
import { checkRateLimit, isSameOrigin, readJsonBody } from "@/lib/request-security";

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
    if (!isSameOrigin(request)) {
      return Response.json({ error: "Invalid request origin." }, { status: 403 });
    }

    const rateLimit = checkRateLimit(request, "admin-login", { limit: 5, windowMs: 15 * 60 * 1000 });
    if (!rateLimit.allowed) {
      return Response.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      );
    }

    const body = await readJsonBody<LoginBody>(request, 2_000);
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

    if (userId.length > 256 || password.length > 1_024 ||
      !matches(userId, expectedUserId) ||
      !matches(password, expectedPassword)
    ) {
      return Response.json(
        { error: "Invalid admin ID or password." },
        { status: 401 },
      );
    }

    return Response.json({ firebaseEmail });
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof Error && error.message === "Request body is too large.") {
      return Response.json({ error: "Invalid login request." }, { status: 400 });
    }
    return Response.json({ error: "Invalid login request." }, { status: 400 });
  }
}
