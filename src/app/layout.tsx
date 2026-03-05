import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const GA_ID = "G-2MGGL7RQ3H";

export const metadata: Metadata = {
  metadataBase: new URL("https://aiphotos.icu"),
  title: {
    default: "PhotoICU - Pet Portraits, Photo Restoration & Enhancement",
    template: "%s | PhotoICU",
  },
  description:
    "Professional AI photo tools suite. Create stunning pet portraits, restore old photos, enhance image quality, remove backgrounds. Free to try!",
  keywords: [
    "AI photo tools",
    "pet portrait AI",
    "photo restoration",
    "photo enhancer",
    "background remover",
    "AI image editor",
    "pet art generator",
    "old photo repair",
  ],
  authors: [{ name: "PhotoICU" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aiphotos.icu",
    siteName: "PhotoICU",
    title: "PhotoICU - Transform Your Photos with AI Magic",
    description:
      "Professional AI photo tools for everyone. Pet portraits, restoration, enhancement & more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PhotoICU - Transform Your Photos with AI",
    description:
      "Professional AI photo tools. Pet portraits, restoration, enhancement & more.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
