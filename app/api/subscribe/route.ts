import { db } from "@/lib/firebase"; // আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী পাথ ঠিক আছে
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

type SubscribePayload = {
  email?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// GET: মোট সাবস্ক্রাইবার সংখ্যা দেখার জন্য
export async function GET() {
  try {
    const subscribersRef = collection(db, "subscribers");
    const snapshot = await getDocs(subscribersRef);

    return Response.json({
      ok: true,
      endpoint: "/api/subscribe",
      subscribersCount: snapshot.size, // ফায়ারস্টোরের টোটাল ডকুমেন্টের সংখ্যা
    });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch subscribers count." },
      { status: 500 },
    );
  }
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

    const subscribersRef = collection(db, "subscribers");

    // ১. ডাটাবেসে এই ইমেইলটি অলরেডি আছে কিনা চেক করা
    const q = query(subscribersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return Response.json({
        success: true,
        message: "You are already subscribed.",
      });
    }

    // ২. ডাটাবেসে নতুন সাবস্ক্রাইবার হিসেবে ইমেইল এবং টাইমস্ট্যাম্প সেভ করা
    await addDoc(subscribersRef, {
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
    return Response.json(
      { error: "An error occurred while processing your request." },
      { status: 400 },
    );
  }
}
