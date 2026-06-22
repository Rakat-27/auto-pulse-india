Auto Pulse India is a Next.js application backed by Firebase Realtime Database.

## Backend setup

The database at `https://auto-pulse-india-2-default-rtdb.firebaseio.com/` is initialized with the base collections in `database.seed.json`.

Add these to `.env.local`. In production, configure the same values in your hosting provider's encrypted environment-variable settings:

```bash
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://auto-pulse-india-2-default-rtdb.firebaseio.com
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

`FIREBASE_SERVICE_ACCOUNT_KEY` is the full JSON from a Firebase service-account key, stored as a single-line value. It is server-only; never prefix it with `NEXT_PUBLIC_` and never commit it. The public contact and newsletter endpoints write through this credential, so public Realtime Database writes can remain disabled.

Before exposing the site, deploy the included Realtime Database rules. The rules deliberately make public content readable while restricting every database write to the Firebase Auth account `admin@autopulse.local`. Contact and newsletter submissions are written server-side through the Firebase Admin SDK.

```bash
npx firebase-tools login
npx firebase-tools use auto-pulse-india-2
npx firebase-tools deploy --only database
```

The current rules deny unauthenticated writes, including direct writes to `subscribers` and `messages`. Deploy them together with the server credential above; otherwise contact and newsletter submissions will fail safely instead of making the database public.

If your `NEXT_PUBLIC_ADMIN_FIREBASE_EMAIL` is not `admin@autopulse.local`, replace that email in `database.rules.json` before deploying. Enable Email/Password in Firebase Authentication and create that one Firebase user with the same password configured in `ADMIN_PASSWORD`.

The public server endpoints are:

- `GET /api/news` — articles and categories, with optional `category`, `search`, and `limit`.
- `POST /api/subscribe` — stores a de-duplicated newsletter email.
- `POST /api/contact` — stores a contact message.

The admin console has live Realtime Database CRUD for products, articles, categories, subscribers, and messages.

## Production launch checklist

- Use Node.js 22 or newer (required by the Firebase Admin SDK).
- Configure every value in `.env.example`, including `FIREBASE_SERVICE_ACCOUNT_KEY`, in the deployment environment before building.
- Deploy the Realtime Database rules with `npx firebase-tools deploy --only database`.
- Use a Cloudinary upload preset restricted to signed/admin uploads or to the exact asset types, sizes, and destination folder required by the console.
- The built-in API limiter protects a single server instance. Enable your host's WAF/rate limiting (for example, Vercel Firewall) for durable multi-instance DDoS and bot protection.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
