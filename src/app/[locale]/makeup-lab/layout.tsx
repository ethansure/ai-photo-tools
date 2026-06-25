import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Makeup Lab - Find Your Best Look",
  description:
    "Upload a selfie and get your top makeup looks with a stylist score, lipstick tweaks, and a foundation shade-match checklist. Minimal, fast, and privacy-friendly.",
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
    "suede skin",
    "blurred skin makeup",
    "soft focus skin filter",
    "foundation shade match",
    "foundation shade finder",
    "undertone finder",
    "sunlit skin",
    "watercolor blush",
    "beach skin makeup",
    "AI blush filter",
    "hazy pout",
    "blurred lip filter",
    "soft lip makeup",
    "AI lip filter",
    "underpainting makeup",
    "blush contour filter",
    "contour preview",
    "cream blush preview",
    "foundation undertone fix",
    "foundation oxidizing orange",
    "selfie foundation match",
    "orange foundation filter",
    "olive undertone",
    "olive foundation match",
    "olive undertone foundation",
    "muted olive skin",
    "sunscreen under makeup",
    "SPF under makeup",
    "foundation pilling",
    "sunscreen pilling",
    "tinted SPF under makeup",
    "non comedogenic sunscreen makeup",
    "pore blurring sunscreen",
    "oily skin sunscreen under makeup",
    "matte sunscreen under makeup",
    "dewy SPF under foundation",
    "sunscreen finish finder",
    "touch up sunscreen over makeup",
    "reapply sunscreen over makeup",
    "SPF powder over makeup",
    "sunscreen spray over makeup",
    "under eye sunscreen concealer",
    "SPF under concealer",
    "eye sunscreen under makeup",
    "concealer creasing over sunscreen",
  ],
  openGraph: {
    title: "Interactive Makeup Lab",
    description:
      "Upload a selfie to get your top makeup looks, lipstick tweaks, and a foundation shade-match checklist.",
    images: ["/examples/headshot-after.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Makeup Lab",
    description:
      "Upload a selfie to get your top makeup looks, lipstick tweaks, and a foundation shade-match checklist.",
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
