import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo Restoration AI - Restore Old & Damaged Photos",
  description: "Restore old, damaged, or faded photos with AI. Remove scratches, enhance faces, and colorize black & white images instantly.",
  keywords: ["photo restoration", "restore old photos", "AI photo repair", "colorize photos", "remove scratches", "face enhancement"],
  openGraph: {
    title: "Photo Restoration AI - Restore Old & Damaged Photos",
    description: "Restore old, damaged, or faded photos with AI. Remove scratches, enhance faces, and colorize black & white images.",
    url: "https://aiphotos.icu/restore",
  },
};

export default function RestoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
