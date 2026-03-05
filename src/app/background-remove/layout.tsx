import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Background Remover AI - Remove Backgrounds Instantly",
  description: "Remove backgrounds from any image instantly with AI. Replace with solid colors, gradients, or custom images. Get transparent PNG.",
  keywords: ["background remover", "remove background", "transparent PNG", "AI background removal", "photo cutout", "background replacement"],
  openGraph: {
    title: "Background Remover AI - Remove Backgrounds Instantly",
    description: "Remove backgrounds from any image instantly with AI. Replace with solid colors, gradients, or custom images.",
    url: "https://aiphotos.icu/remove-bg",
  },
};

export default function RemoveBgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
