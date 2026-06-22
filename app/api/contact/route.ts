import { pushRecord } from "@/lib/realtime-db";
import { checkRateLimit, isSameOrigin, readJsonBody } from "@/lib/request-security";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET() {
  return Response.json({
    ok: true,
    endpoint: "/api/contact",
    storage: "Firebase Realtime Database",
  });
}

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return Response.json({ error: "Invalid request origin." }, { status: 403 });
    }

    const rateLimit = checkRateLimit(request, "contact", { limit: 5, windowMs: 15 * 60 * 1000 });
    if (!rateLimit.allowed) {
      return Response.json(
        { error: "Too many messages. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      );
    }

    const body = await readJsonBody<ContactPayload>(request);
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const subject = body.subject?.trim();
    const message = body.message?.trim();

    if (!name || !email || !subject || !message) {
      return Response.json(
        { error: "Name, email, subject, and message are required." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return Response.json(
        { error: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    if (name.length > 120 || email.length > 254 || subject.length > 200 || message.length > 5_000) {
      return Response.json({ error: "One or more fields are too long." }, { status: 400 });
    }

    const id = await pushRecord("messages", {
      name,
      email,
      subject,
      message,
      status: "unread",
      receivedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    return Response.json(
      { success: true, id, message: "Message received successfully." },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof Error && error.message === "Request body is too large.") {
      return Response.json({ error: "Invalid request body." }, { status: 400 });
    }
    return Response.json(
      { error: "Unable to save your message right now." },
      { status: 500 },
    );
  }
}
