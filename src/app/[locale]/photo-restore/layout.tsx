import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restore Studio - AI Old Photo Restoration",
  description: "Restore old, damaged, and faded photos with AI. Restore Studio helps you repair scratches, enhance faces, and upscale results. Simple controls with optional advanced overrides.",
  keywords: [
    "AI photo restoration",
    "restore old photos",
    "fix damaged photos",
    "photo repair online",
    "colorize old photos",
    "enhance old photos",
    "scratch removal",
    "face enhancement AI",
    "photo restoration free",
    "repair vintage photos",
    "restore family photos",
    "GFPGAN"
  ],
  openGraph: {
    title: "Restore Studio - Bring Old Photos Back to Life",
    description: "Restore old, damaged, and faded photos instantly with AI. Repair damage, enhance faces, and upscale results.",
    images: ["/examples/restore-after.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Restore Studio - AI Photo Restoration",
    description: "Restore damaged and old photos with AI. Repair, enhance, and upscale with Restore Studio.",
    images: ["/examples/restore-after.png"],
  },
  alternates: {
    canonical: "https://aiphotos.icu/photo-restore",
  },
};

export default function PhotoRestoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
