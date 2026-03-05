import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Style Transfer AI - Transform Photos into Art",
  description: "Transform your photos into artistic masterpieces with AI. Apply styles from Van Gogh, Monet, anime, and more. Free online style transfer.",
  keywords: ["style transfer", "photo to art", "AI art", "Van Gogh filter", "Monet style", "anime filter", "artistic photo"],
  openGraph: {
    title: "Style Transfer AI - Transform Photos into Art",
    description: "Transform your photos into artistic masterpieces with AI. Apply styles from Van Gogh, Monet, anime, and more.",
    url: "https://aiphotos.icu/style-transfer",
  },
};

export default function StyleTransferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
