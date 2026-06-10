import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Makeup Lab - Find Your Best Look",
  description:
    "Upload a selfie and get your top makeup looks with a stylist score and quick tweaks for lipstick shade + intensity. Minimal, fast, and privacy-friendly.",
  keywords: [
    "makeup look finder",
    "makeup analyzer",
    "makeup lab",
    "selfie makeup recommendations",
    "lipstick shade",
    "undertone makeup",
    "professional makeup",
    "makeup for headshots",
    "blurry makeup",
    "cloud makeup",
    "natural makeup filter",
  ],
  openGraph: {
    title: "Interactive Makeup Lab",
    description:
      "Upload a selfie to get your top makeup looks with a stylist score and quick lipstick tweaks.",
    images: ["/examples/headshot-after.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Makeup Lab",
    description:
      "Upload a selfie to get your top makeup looks with a stylist score and quick lipstick tweaks.",
    images: ["/examples/headshot-after.jpg"],
  },
  alternates: {
    canonical: "https://aiphotos.icu/makeup-lab",
  },
};

export default function MakeupLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
