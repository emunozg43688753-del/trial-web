import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/dashboard";

export const metadata: Metadata = {
  title: "Mi panel",
  robots: { index: false, follow: false },
};

export default function AppPage() {
  return <Dashboard />;
}
