import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo Enhancer AI - Upscale & Enhance Images",
  description: "Upscale and enhance your photos with AI. Increase resolution up to 4x while preserving quality. Noise reduction and detail enhancement.",
  keywords: ["photo enhancer", "upscale image", "AI image enhancement", "4x upscale", "noise reduction", "image quality"],
  openGraph: {
    title: "Photo Enhancer AI - Upscale & Enhance Images",
    description: "Upscale and enhance your photos with AI. Increase resolution up to 4x while preserving quality.",
    url: "https://aiphotos.icu/enhance",
  },
};

export default function EnhanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
