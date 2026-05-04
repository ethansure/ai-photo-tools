import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Type AI - Try Male/Female Styles on Your Photo",
  description:
    "Upload your photo and try different male/female looks with AI. Choose muscular, streetwear, cyberpunk, old money and more styles in seconds.",
  keywords: [
    "AI gender style",
    "AI style try on",
    "AI photo style",
    "muscular AI",
    "streetwear AI",
    "cyberpunk AI",
    "old money style AI",
    "K-pop idol AI",
    "AI portrait generator",
    "photo makeover AI",
  ],
  openGraph: {
    title: "My Type AI - Style Try-On",
    description:
      "Try different male/female looks on your photo with AI. Pick muscular and multiple popular styles.",
    images: ["/examples/headshot-after.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Type AI",
    description: "Try different male/female looks on your photo with AI.",
    images: ["/examples/headshot-after.jpg"],
  },
  alternates: {
    canonical: "https://aiphotos.icu/my-type",
  },
};

export default function MyTypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

