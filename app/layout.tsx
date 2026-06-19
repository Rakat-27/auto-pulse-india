import "./globals.css";
import Navbar from "@/app/component/Navbar";

export const metadata = {
  title: "Auto Pulse India - Car & Bike News",
  description: "Latest car and bike updates, reviews, and trends.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-zinc-900 transition-colors duration-200 dark:bg-zinc-950 dark:text-white">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
