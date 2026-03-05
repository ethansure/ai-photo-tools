import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Headshots - Professional Headshots from Selfies",
  description: "Generate professional headshots from your selfie with AI. Perfect for LinkedIn, resumes, and business profiles. Multiple styles available.",
  keywords: ["AI headshots", "professional headshot", "LinkedIn photo", "corporate headshot", "selfie to headshot", "business portrait"],
  openGraph: {
    title: "AI Headshots - Professional Headshots from Selfies",
    description: "Generate professional headshots from your selfie with AI. Perfect for LinkedIn, resumes, and business profiles.",
    url: "https://aiphotos.icu/headshots",
  },
};

export default function HeadshotsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
