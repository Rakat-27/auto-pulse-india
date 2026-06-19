type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

type ContactMessage = Required<ContactPayload> & {
  id: string;
  receivedAt: string;
};

const globalForContact = globalThis as typeof globalThis & {
  autoPulseContactMessages?: ContactMessage[];
};

const contactMessages =
  globalForContact.autoPulseContactMessages ??
  (globalForContact.autoPulseContactMessages = []);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET() {
  return Response.json({
    ok: true,
    endpoint: "/api/contact",
    storedMessages: contactMessages.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;
    const name = body.name?.trim();
    const email = body.email?.trim();
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

    const contactMessage: ContactMessage = {
      id: crypto.randomUUID(),
      name,
      email,
      subject,
      message,
      receivedAt: new Date().toISOString(),
    };

    contactMessages.unshift(contactMessage);

    return Response.json(
      {
        success: true,
        id: contactMessage.id,
        message: "Message received successfully.",
      },
      { status: 201 },
    );
  } catch {
    return Response.json(
      { error: "Invalid request body. Send JSON data to this endpoint." },
      { status: 400 },
    );
  }
}
