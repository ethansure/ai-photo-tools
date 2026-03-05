"use client";

import { Button } from "@/components/ui/button";
import { Download, Share2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DownloadButtonProps {
  imageUrl: string;
  filename?: string;
  variant?: "default" | "outline" | "secondary";
  showShare?: boolean;
  className?: string;
}

export function DownloadButton({ 
  imageUrl, 
  filename = "ai-photo.png",
  variant = "default",
  showShare = false,
  className 
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Image downloaded!");
    } catch {
      toast.error("Failed to download image");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], filename, { type: blob.type });
        await navigator.share({
          title: "AI Photo Tools",
          text: "Check out this image I created!",
          files: [file],
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy URL
      await navigator.clipboard.writeText(imageUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className={className}>
      <div className="flex gap-2">
        <Button 
          variant={variant} 
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Download
        </Button>
        {showShare && (
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        )}
      </div>
    </div>
  );
}
