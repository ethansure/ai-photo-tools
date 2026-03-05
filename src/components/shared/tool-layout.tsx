"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

interface ToolLayoutProps {
  title: string;
  description: string;
  badge: string;
  badgeIcon: ReactNode;
  children: ReactNode;
}

export function ToolLayout({ title, description, badge, badgeIcon, children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back to Tools</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🖼️</span>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              AI Photo Tools
            </span>
          </Link>
          <div className="w-24" /> {/* Spacer */}
        </div>
      </header>

      <main className="py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Tool Header */}
          <div className="text-center mb-8">
            <Badge className="mb-3 bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 hover:from-violet-100 hover:to-indigo-100">
              {badgeIcon}
              <span className="ml-1">{badge}</span>
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
