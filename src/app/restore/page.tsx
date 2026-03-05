"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToolLayout } from "@/components/shared/tool-layout";
import { ImageUpload } from "@/components/shared/image-upload";
import { ProcessingState } from "@/components/shared/processing-state";
import { BeforeAfter } from "@/components/shared/before-after";
import { DownloadButton } from "@/components/shared/download-button";
import { Camera, Sparkles, RotateCcw, Wand2 } from "lucide-react";
import { toast } from "sonner";

type Mode = "upload" | "options" | "processing" | "results";

const restorationOptions = [
  { id: "face", name: "Face Restoration", description: "Enhance and restore facial features", icon: "👤" },
  { id: "scratch", name: "Scratch Removal", description: "Remove scratches and damage", icon: "🔧" },
  { id: "colorize", name: "Colorize B&W", description: "Add color to black and white photos", icon: "🎨" },
];

export default function RestorePage() {
  const [mode, setMode] = useState<Mode>("upload");
  const [uploadedImage, setUploadedImage] = useState<{ file: File; preview: string } | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(["face"]);
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

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleRestore = async () => {
    if (!uploadedImage) return;
    
    setMode("processing");
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 15, 95));
    }, 500);

    try {
      const formData = new FormData();
      formData.append("image", uploadedImage.file);
      formData.append("mode", selectedOptions.includes("face") ? "face" : "scratch");
      formData.append("faceEnhance", String(selectedOptions.includes("face")));
      formData.append("colorize", String(selectedOptions.includes("colorize")));

      const response = await fetch("/api/restore", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      clearInterval(progressInterval);
      setProgress(100);

      if (data.success) {
        setResultImage(data.image);
        setTimeout(() => setMode("results"), 500);
        toast.success("Photo restored successfully!");
      } else {
        throw new Error(data.error);
      }
    } catch {
      clearInterval(progressInterval);
      toast.error("Failed to restore photo. Please try again.");
      setMode("options");
    }
  };

  const handleStartOver = () => {
    handleClearImage();
    setSelectedOptions(["face"]);
    setResultImage(null);
    setMode("upload");
  };

  return (
    <ToolLayout
      title="Photo Restoration"
      description="Restore old, damaged, or faded photos with AI. Remove scratches, enhance faces, and colorize black & white images."
      badge="AI Restoration"
      badgeIcon={<Camera className="h-3 w-3" />}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {mode === "upload" && (
              <>
                <Camera className="h-5 w-5" />
                Upload Your Photo
              </>
            )}
            {mode === "options" && (
              <>
                <Wand2 className="h-5 w-5" />
                Choose Restoration Options
              </>
            )}
            {mode === "processing" && (
              <>
                <Sparkles className="h-5 w-5" />
                Restoring Your Photo
              </>
            )}
            {mode === "results" && (
              <>
                <Sparkles className="h-5 w-5" />
                Restoration Complete!
              </>
            )}
          </CardTitle>
          <CardDescription>
            {mode === "upload" && "Upload an old or damaged photo for AI restoration"}
            {mode === "options" && "Select the restoration options you need"}
            {mode === "processing" && "Our AI is carefully restoring your photo"}
            {mode === "results" && "Compare the before and after, then download"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === "upload" && (
            <ImageUpload
              onImageUpload={handleImageUpload}
              currentImage={null}
              onClear={() => {}}
              title="Upload photo to restore"
              tips={[
                "Old, damaged, or faded photos work best",
                "Higher resolution = better results",
                "Works with both color and B&W photos"
              ]}
            />
          )}

          {mode === "options" && uploadedImage && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative w-64 h-64 rounded-xl overflow-hidden">
                  <img
                    src={uploadedImage.preview}
                    alt="Photo to restore"
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

              <div className="grid sm:grid-cols-3 gap-4">
                {restorationOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => toggleOption(option.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedOptions.includes(option.id)
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-3xl mb-2">{option.icon}</div>
                    <div className="font-medium">{option.name}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleClearImage}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Change Photo
                </Button>
                <Button 
                  onClick={handleRestore}
                  disabled={selectedOptions.length === 0}
                  className="bg-gradient-to-r from-violet-500 to-indigo-500"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Restore Photo
                </Button>
              </div>
            </div>
          )}

          {mode === "processing" && (
            <ProcessingState
              progress={progress}
              message="Restoring your photo..."
              subMessage="Our AI is carefully enhancing your image"
            />
          )}

          {mode === "results" && uploadedImage && resultImage && (
            <div className="space-y-6">
              <BeforeAfter
                before={uploadedImage.preview}
                after={resultImage}
                className="max-w-lg mx-auto"
              />
              
              <div className="flex justify-center gap-4">
                <DownloadButton 
                  imageUrl={resultImage} 
                  filename="restored-photo.png"
                  showShare
                />
                <Button variant="outline" onClick={handleStartOver}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restore Another
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
