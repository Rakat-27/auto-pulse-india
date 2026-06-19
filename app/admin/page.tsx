import type { Metadata } from "next";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "Admin Console | AutoPulse",
  description: "Manage AutoPulse content and inventory.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClient />;
}
