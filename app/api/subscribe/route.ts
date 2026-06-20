import { emailKey, readRecord, writeRecord } from "@/lib/realtime-db";

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
    const body = (await request.json()) as SubscribePayload;
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
  } catch {
    return Response.json(
      { error: "An error occurred while processing your request." },
      { status: 400 },
    );
  }
}
