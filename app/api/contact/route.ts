import { pushRecord } from "@/lib/realtime-db";

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
    const body = (await request.json()) as ContactPayload;
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
  } catch {
    return Response.json(
      { error: "Unable to save your message right now." },
      { status: 500 },
    );
  }
}
