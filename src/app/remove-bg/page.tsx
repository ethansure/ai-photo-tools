"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToolLayout } from "@/components/shared/tool-layout";
import { ImageUpload } from "@/components/shared/image-upload";
import { ProcessingState } from "@/components/shared/processing-state";
import { DownloadButton } from "@/components/shared/download-button";
import { customBackgrounds } from "@/lib/styles";
import { Scissors, Sparkles, RotateCcw, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import React from "react";

type Mode = "upload" | "processing" | "results";

export default function RemoveBgPage() {
  const [mode, setMode] = useState<Mode>("upload");
  const [uploadedImage, setUploadedImage] = useState<{ file: File; preview: string } | null>(null);
  const [progress, setProgress] = useState(0);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [selectedBg, setSelectedBg] = useState<string>("transparent");

  const handleImageUpload = async (file: File, preview: string) => {
    setUploadedImage({ file, preview });
    
    setMode("processing");
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 20, 95));
    }, 400);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      clearInterval(progressInterval);
      setProgress(100);

      if (data.success) {
        setResultImage(data.image);
        setTimeout(() => setMode("results"), 500);
        toast.success("Background removed!");
      } else {
        throw new Error(data.error);
      }
    } catch {
      clearInterval(progressInterval);
      toast.error("Failed to remove background. Please try again.");
      handleClearImage();
    }
  };

  const handleClearImage = () => {
    if (uploadedImage?.preview) {
      URL.revokeObjectURL(uploadedImage.preview);
    }
    setUploadedImage(null);
    setResultImage(null);
    setSelectedBg("transparent");
    setMode("upload");
  };

  const getBackgroundStyle = (bgId: string): React.CSSProperties => {
    const bg = customBackgrounds.find(b => b.id === bgId);
    if (!bg) return {};
    
    if (bg.id === "transparent") {
      return {
        backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%),
          linear-gradient(-45deg, #ccc 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #ccc 75%),
          linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px"
      };
    }
    
    if (bg.isImage) {
      return { backgroundImage: `url(${bg.preview})`, backgroundSize: "cover", backgroundPosition: "center" };
    }
    
    if (bg.color?.startsWith("linear-gradient")) {
      return { backgroundImage: bg.color };
    }
    
    return { backgroundColor: bg.color || undefined };
  };

  return (
    <ToolLayout
      title="Background Remover"
      description="Remove backgrounds from any image instantly with AI. Replace with solid colors, gradients, or custom images."
      badge="AI Background"
      badgeIcon={<Scissors className="h-3 w-3" />}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {mode === "upload" && (
              <>
                <ImageIcon className="h-5 w-5" />
                Upload Image
              </>
            )}
            {mode === "processing" && (
              <>
                <Scissors className="h-5 w-5" />
                Removing Background
              </>
            )}
            {mode === "results" && (
              <>
                <Sparkles className="h-5 w-5" />
                Background Removed!
              </>
            )}
          </CardTitle>
          <CardDescription>
            {mode === "upload" && "Upload any image to remove its background"}
            {mode === "processing" && "AI is detecting and removing the background"}
            {mode === "results" && "Choose a new background or download as transparent PNG"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === "upload" && (
            <ImageUpload
              onImageUpload={handleImageUpload}
              currentImage={null}
              onClear={() => {}}
              title="Upload image to remove background"
              tips={[
                "Works best with clear subjects",
                "People, products, and pets work great",
                "High contrast between subject and background helps"
              ]}
            />
          )}

          {mode === "processing" && (
            <ProcessingState
              progress={progress}
              message="Removing background..."
              subMessage="AI is separating the subject from background"
              icon="sparkles"
            />
          )}

          {mode === "results" && resultImage && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div 
                  className="relative w-80 h-80 rounded-2xl overflow-hidden shadow-lg"
                  style={getBackgroundStyle(selectedBg)}
                >
                  <img
                    src={resultImage}
                    alt="Result"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-center">Choose Background</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {customBackgrounds.slice(0, 10).map(bg => (
                    <button
                      key={bg.id}
                      onClick={() => setSelectedBg(bg.id)}
                      className={`w-12 h-12 rounded-lg border-2 overflow-hidden transition-all ${
                        selectedBg === bg.id ? "border-primary ring-2 ring-primary/50" : "border-gray-200"
                      }`}
                      style={getBackgroundStyle(bg.id)}
                      title={bg.name}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <DownloadButton 
                  imageUrl={resultImage} 
                  filename="removed-bg.png"
                  showShare
                />
                <Button variant="outline" onClick={handleClearImage}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Remove Another
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {mode === "upload" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">🚀 Batch Processing</CardTitle>
            <CardDescription>
              Need to remove backgrounds from multiple images? Coming soon!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-xl p-6 text-center">
              <p className="text-muted-foreground">
                Batch processing will allow you to remove backgrounds from up to 20 images at once.
              </p>
              <Button variant="outline" className="mt-4" disabled>
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </ToolLayout>
  );
}
