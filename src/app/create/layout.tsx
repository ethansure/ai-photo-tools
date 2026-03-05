import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pet Portrait AI - Transform Pets into Stunning Artwork",
  description: "Create beautiful AI-generated portraits of your pets. 70+ art styles including royal portraits, Disney Pixar, anime, and more. Free to try!",
  keywords: ["pet portrait AI", "dog portrait", "cat portrait", "pet art", "AI pet painting", "royal pet portrait", "Disney pet portrait"],
  openGraph: {
    title: "Pet Portrait AI - Transform Pets into Stunning Artwork",
    description: "Create beautiful AI-generated portraits of your pets. 70+ art styles including royal portraits, Disney Pixar, anime, and more.",
    url: "https://aiphotos.icu/create",
  },
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
