import { emailKey, readRecord, writeRecord } from "@/lib/realtime-db";
import { checkRateLimit, isSameOrigin, readJsonBody } from "@/lib/request-security";

type SubscribePayload = {
  email?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET() {
  return Response.json({ ok: true, endpoint: "/api/subscribe" });
}

// POST: নতুন ইমেইল সাবস্ক্রাইব করার জন্য
export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return Response.json({ error: "Invalid request origin." }, { status: 403 });
    }

    const rateLimit = checkRateLimit(request, "subscribe", { limit: 3, windowMs: 60 * 60 * 1000 });
    if (!rateLimit.allowed) {
      return Response.json(
        { error: "Too many subscription attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      );
    }

    const body = await readJsonBody<SubscribePayload>(request, 1_000);
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return Response.json(
        { error: "Email address is required." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return Response.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (email.length > 254) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const key = emailKey(email);
    if (await readRecord(`subscribers/${key}`)) {
      return Response.json({
        success: true,
        message: "You are already subscribed.",
      });
    }

    await writeRecord(`subscribers/${key}`, {
      email,
      subscribedAt: new Date().toISOString(),
    });

    return Response.json(
      {
        success: true,
        message: "Subscription successful.",
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof Error && error.message === "Request body is too large.") {
      return Response.json({ error: "Invalid request body." }, { status: 400 });
    }
    return Response.json(
      { error: "An error occurred while processing your request." },
      { status: 400 },
    );
  }
}
