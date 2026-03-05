"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToolLayout } from "@/components/shared/tool-layout";
import { ImageUpload } from "@/components/shared/image-upload";
import { ProcessingState } from "@/components/shared/processing-state";
import { BeforeAfter } from "@/components/shared/before-after";
import { DownloadButton } from "@/components/shared/download-button";
import { styleTransferStyles } from "@/lib/styles";
import { Palette, Sparkles, RotateCcw, Brush } from "lucide-react";
import { toast } from "sonner";

type Mode = "upload" | "style" | "processing" | "results";

export default function StyleTransferPage() {
  const [mode, setMode] = useState<Mode>("upload");
  const [uploadedImage, setUploadedImage] = useState<{ file: File; preview: string } | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<typeof styleTransferStyles[0] | null>(null);
  const [strength, setStrength] = useState(0.75);
  const [progress, setProgress] = useState(0);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleImageUpload = (file: File, preview: string) => {
    setUploadedImage({ file, preview });
    setMode("style");
  };

  const handleClearImage = () => {
    if (uploadedImage?.preview) {
      URL.revokeObjectURL(uploadedImage.preview);
    }
    setUploadedImage(null);
    setMode("upload");
  };

  const handleStyleTransfer = async () => {
    if (!uploadedImage || !selectedStyle) return;
    
    setMode("processing");
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 10, 95));
    }, 600);

    try {
      const formData = new FormData();
      formData.append("image", uploadedImage.file);
      formData.append("style", selectedStyle.id);
      formData.append("stylePrompt", selectedStyle.prompt);
      formData.append("strength", String(strength));

      const response = await fetch("/api/style-transfer", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      clearInterval(progressInterval);
      setProgress(100);

      if (data.success) {
        setResultImage(data.image);
        setTimeout(() => setMode("results"), 500);
        toast.success("Style applied successfully!");
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      clearInterval(progressInterval);
      toast.error("Failed to apply style. Please try again.");
      setMode("style");
    }
  };

  const handleStartOver = () => {
    handleClearImage();
    setSelectedStyle(null);
    setStrength(0.75);
    setResultImage(null);
    setMode("upload");
  };

  return (
    <ToolLayout
      title="Style Transfer"
      description="Transform your photos into artistic masterpieces. Apply styles from famous artists like Van Gogh, Monet, or go anime!"
      badge="AI Art"
      badgeIcon={<Palette className="h-3 w-3" />}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {mode === "upload" && (
              <>
                <Brush className="h-5 w-5" />
                Upload Your Photo
              </>
            )}
            {mode === "style" && (
              <>
                <Palette className="h-5 w-5" />
                Choose Art Style
              </>
            )}
            {mode === "processing" && (
              <>
                <Sparkles className="h-5 w-5" />
                Applying Style
              </>
            )}
            {mode === "results" && (
              <>
                <Sparkles className="h-5 w-5" />
                Transformation Complete!
              </>
            )}
          </CardTitle>
          <CardDescription>
            {mode === "upload" && "Upload any photo to transform into art"}
            {mode === "style" && "Select an artistic style to apply"}
            {mode === "processing" && "AI is transforming your photo into art"}
            {mode === "results" && "Your artistic transformation is ready"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === "upload" && (
            <ImageUpload
              onImageUpload={handleImageUpload}
              currentImage={null}
              onClear={() => {}}
              title="Upload photo for style transfer"
              tips={[
                "Portraits and landscapes work beautifully",
                "Higher resolution = more detail in output",
                "Photos with clear subjects work best"
              ]}
            />
          )}

          {mode === "style" && uploadedImage && (
            <div className="space-y-6">
              {/* Preview */}
              <div className="flex justify-center">
                <div className="relative w-48 h-48 rounded-xl overflow-hidden">
                  <img
                    src={uploadedImage.preview}
                    alt="Photo to style"
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={handleClearImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Style Grid */}
              <div>
                <h4 className="font-medium mb-3">Select Art Style</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {styleTransferStyles.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        selectedStyle?.id === style.id
                          ? "border-primary ring-2 ring-primary/50 scale-105"
                          : "border-gray-200 hover:border-gray-300 hover:scale-102"
                      }`}
                    >
                      <img
                        src={style.preview}
                        alt={style.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/70 px-1 py-0.5">
                        <span className="text-white text-[10px] font-medium line-clamp-1">
                          {style.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Strength Slider */}
              {selectedStyle && (
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Style Strength</span>
                    <span className="text-sm text-muted-foreground">{Math.round(strength * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="1"
                    step="0.05"
                    value={strength}
                    onChange={(e) => setStrength(parseFloat(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Subtle</span>
                    <span>Strong</span>
                  </div>
                </div>
              )}

              {/* Action */}
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleClearImage}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Change Photo
                </Button>
                <Button 
                  onClick={handleStyleTransfer}
                  disabled={!selectedStyle}
                  className="bg-gradient-to-r from-violet-500 to-indigo-500"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Apply {selectedStyle?.name || "Style"}
                </Button>
              </div>
            </div>
          )}

          {mode === "processing" && selectedStyle && (
            <ProcessingState
              progress={progress}
              message={`Applying ${selectedStyle.name} style...`}
              subMessage="AI is transforming your photo into art"
            />
          )}

          {mode === "results" && uploadedImage && resultImage && (
            <div className="space-y-6">
              <BeforeAfter
                before={uploadedImage.preview}
                after={resultImage}
                className="max-w-lg mx-auto"
              />
              
              <div className="text-center">
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  🎨 {selectedStyle?.name} Style
                </span>
              </div>
              
              <div className="flex justify-center gap-4">
                <DownloadButton 
                  imageUrl={resultImage} 
                  filename={`${selectedStyle?.id || "styled"}-art.png`}
                  showShare
                />
                <Button variant="outline" onClick={handleStartOver}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Create Another
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
