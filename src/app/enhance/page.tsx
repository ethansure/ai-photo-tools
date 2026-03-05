"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToolLayout } from "@/components/shared/tool-layout";
import { ImageUpload } from "@/components/shared/image-upload";
import { ProcessingState } from "@/components/shared/processing-state";
import { BeforeAfter } from "@/components/shared/before-after";
import { DownloadButton } from "@/components/shared/download-button";
import { Sparkles, RotateCcw, Zap, ArrowUpCircle } from "lucide-react";
import { toast } from "sonner";

type Mode = "upload" | "options" | "processing" | "results";

const scaleOptions = [
  { id: "2", label: "2x Upscale", description: "Good balance of speed and quality" },
  { id: "4", label: "4x Upscale", description: "Maximum quality, larger file size" },
];

export default function EnhancePage() {
  const [mode, setMode] = useState<Mode>("upload");
  const [uploadedImage, setUploadedImage] = useState<{ file: File; preview: string } | null>(null);
  const [scale, setScale] = useState("2");
  const [faceEnhance, setFaceEnhance] = useState(true);
  const [progress, setProgress] = useState(0);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleImageUpload = (file: File, preview: string) => {
    setUploadedImage({ file, preview });
    setMode("options");
  };

  const handleClearImage = () => {
    if (uploadedImage?.preview) {
      URL.revokeObjectURL(uploadedImage.preview);
    }
    setUploadedImage(null);
    setMode("upload");
  };

  const handleEnhance = async () => {
    if (!uploadedImage) return;
    
    setMode("processing");
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 12, 95));
    }, 500);

    try {
      const formData = new FormData();
      formData.append("image", uploadedImage.file);
      formData.append("scale", scale);
      formData.append("faceEnhance", String(faceEnhance));

      const response = await fetch("/api/enhance", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      clearInterval(progressInterval);
      setProgress(100);

      if (data.success) {
        setResultImage(data.image);
        setTimeout(() => setMode("results"), 500);
        toast.success("Photo enhanced successfully!");
      } else {
        throw new Error(data.error);
      }
    } catch {
      clearInterval(progressInterval);
      toast.error("Failed to enhance photo. Please try again.");
      setMode("options");
    }
  };

  const handleStartOver = () => {
    handleClearImage();
    setScale("2");
    setFaceEnhance(true);
    setResultImage(null);
    setMode("upload");
  };

  return (
    <ToolLayout
      title="Photo Enhancer"
      description="Upscale and enhance your photos with AI. Increase resolution up to 4x while preserving quality."
      badge="AI Enhancer"
      badgeIcon={<Sparkles className="h-3 w-3" />}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {mode === "upload" && (
              <>
                <ArrowUpCircle className="h-5 w-5" />
                Upload Photo to Enhance
              </>
            )}
            {mode === "options" && (
              <>
                <Zap className="h-5 w-5" />
                Enhancement Options
              </>
            )}
            {mode === "processing" && (
              <>
                <Sparkles className="h-5 w-5" />
                Enhancing Your Photo
              </>
            )}
            {mode === "results" && (
              <>
                <Sparkles className="h-5 w-5" />
                Enhancement Complete!
              </>
            )}
          </CardTitle>
          <CardDescription>
            {mode === "upload" && "Upload any photo to upscale and enhance"}
            {mode === "options" && "Choose your enhancement settings"}
            {mode === "processing" && "AI is enhancing your image quality"}
            {mode === "results" && "Your enhanced photo is ready"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === "upload" && (
            <ImageUpload
              onImageUpload={handleImageUpload}
              currentImage={null}
              onClear={() => {}}
              title="Upload photo to enhance"
              tips={[
                "Works with any image resolution",
                "Best for improving low-quality photos",
                "Preserves original colors and details"
              ]}
            />
          )}

          {mode === "options" && uploadedImage && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative w-64 h-64 rounded-xl overflow-hidden">
                  <img
                    src={uploadedImage.preview}
                    alt="Photo to enhance"
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={handleClearImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Upscale Factor</h4>
                <div className="grid grid-cols-2 gap-4">
                  {scaleOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => setScale(option.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        scale === option.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl font-bold text-primary">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div>
                  <div className="font-medium">Face Enhancement</div>
                  <div className="text-sm text-muted-foreground">Extra processing for faces in the image</div>
                </div>
                <button
                  onClick={() => setFaceEnhance(!faceEnhance)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    faceEnhance ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    faceEnhance ? "translate-x-6" : "translate-x-0.5"
                  }`} />
                </button>
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleClearImage}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Change Photo
                </Button>
                <Button 
                  onClick={handleEnhance}
                  className="bg-gradient-to-r from-violet-500 to-indigo-500"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Enhance Photo ({scale}x)
                </Button>
              </div>
            </div>
          )}

          {mode === "processing" && (
            <ProcessingState
              progress={progress}
              message={`Upscaling to ${scale}x resolution...`}
              subMessage="AI is enhancing every detail"
            />
          )}

          {mode === "results" && uploadedImage && resultImage && (
            <div className="space-y-6">
              <BeforeAfter
                before={uploadedImage.preview}
                after={resultImage}
                className="max-w-lg mx-auto"
              />
              
              <div className="text-center text-sm text-muted-foreground">
                📐 Original → {scale}x larger resolution
              </div>
              
              <div className="flex justify-center gap-4">
                <DownloadButton 
                  imageUrl={resultImage} 
                  filename={`enhanced-${scale}x.png`}
                  showShare
                />
                <Button variant="outline" onClick={handleStartOver}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Enhance Another
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
