Auto Pulse India is a Next.js application backed by Firebase Realtime Database.

## Backend setup

The database at `https://auto-pulse-india-2-default-rtdb.firebaseio.com/` is initialized with the base collections in `database.seed.json`.

Add this to `.env.local` (the application also has this URL as a safe fallback):

```bash
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://auto-pulse-india-2-default-rtdb.firebaseio.com
```

Before exposing the site, deploy the included Realtime Database rules. The rules deliberately make articles, categories, and products public-readable; they restrict all administration to the Firebase Auth account `admin@autopulse.local`, and allow only initial public submissions for newsletter subscriptions and contact messages.

```bash
npx firebase-tools login
npx firebase-tools use auto-pulse-india-2
npx firebase-tools deploy --only database
```

If your `NEXT_PUBLIC_ADMIN_FIREBASE_EMAIL` is not `admin@autopulse.local`, replace that email in `database.rules.json` before deploying. Enable Email/Password in Firebase Authentication and create that one Firebase user with the same password configured in `ADMIN_PASSWORD`.

The public server endpoints are:

- `GET /api/news` — articles and categories, with optional `category`, `search`, and `limit`.
- `POST /api/subscribe` — stores a de-duplicated newsletter email.
- `POST /api/contact` — stores a contact message.

The admin console has live Realtime Database CRUD for products, articles, categories, subscribers, and messages.

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
