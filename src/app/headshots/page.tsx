"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToolLayout } from "@/components/shared/tool-layout";
import { ImageUpload } from "@/components/shared/image-upload";
import { ProcessingState } from "@/components/shared/processing-state";
import { DownloadButton } from "@/components/shared/download-button";
import { headshotStyles } from "@/lib/styles";
import { User, Sparkles, RotateCcw, Camera, Briefcase } from "lucide-react";
import { toast } from "sonner";

type Mode = "upload" | "style" | "processing" | "results";

export default function HeadshotsPage() {
  const [mode, setMode] = useState<Mode>("upload");
  const [uploadedImage, setUploadedImage] = useState<{ file: File; preview: string } | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<typeof headshotStyles[0] | null>(null);
  const [gender, setGender] = useState<"male" | "female" | "neutral">("neutral");
  const [progress, setProgress] = useState(0);
  const [resultImages, setResultImages] = useState<string[]>([]);
  const [selectedResult, setSelectedResult] = useState(0);

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

  const handleGenerate = async () => {
    if (!uploadedImage || !selectedStyle) return;
    
    setMode("processing");
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 8, 95));
    }, 700);

    try {
      const formData = new FormData();
      formData.append("image", uploadedImage.file);
      formData.append("style", selectedStyle.id);
      formData.append("stylePrompt", selectedStyle.prompt);
      formData.append("gender", gender);

      const response = await fetch("/api/headshots", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      clearInterval(progressInterval);
      setProgress(100);

      if (data.success) {
        setResultImages(data.images);
        setTimeout(() => setMode("results"), 500);
        toast.success("Headshots generated!");
      } else {
        throw new Error(data.error);
      }
    } catch {
      clearInterval(progressInterval);
      toast.error("Failed to generate headshots. Please try again.");
      setMode("style");
    }
  };

  const handleStartOver = () => {
    handleClearImage();
    setSelectedStyle(null);
    setGender("neutral");
    setResultImages([]);
    setSelectedResult(0);
    setMode("upload");
  };

  return (
    <ToolLayout
      title="AI Headshots"
      description="Generate professional headshots from your selfie. Perfect for LinkedIn, resumes, and business profiles."
      badge="AI Headshots"
      badgeIcon={<Briefcase className="h-3 w-3" />}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {mode === "upload" && (
              <>
                <Camera className="h-5 w-5" />
                Upload Your Selfie
              </>
            )}
            {mode === "style" && (
              <>
                <User className="h-5 w-5" />
                Choose Headshot Style
              </>
            )}
            {mode === "processing" && (
              <>
                <Sparkles className="h-5 w-5" />
                Generating Headshots
              </>
            )}
            {mode === "results" && (
              <>
                <Sparkles className="h-5 w-5" />
                Your Professional Headshots
              </>
            )}
          </CardTitle>
          <CardDescription>
            {mode === "upload" && "Upload a clear selfie - front-facing with good lighting"}
            {mode === "style" && "Select the professional style for your headshots"}
            {mode === "processing" && "AI is creating your professional headshots"}
            {mode === "results" && "Choose your favorite and download"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === "upload" && (
            <ImageUpload
              onImageUpload={handleImageUpload}
              currentImage={null}
              onClear={() => {}}
              aspectRatio="portrait"
              title="Upload your selfie"
              tips={[
                "Use a front-facing, clear photo of your face",
                "Good lighting is essential for best results",
                "Neutral expression or slight smile works best",
                "Avoid heavy filters or sunglasses"
              ]}
            />
          )}

          {mode === "style" && uploadedImage && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative w-40 h-52 rounded-xl overflow-hidden">
                  <img
                    src={uploadedImage.preview}
                    alt="Your photo"
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

              <div>
                <h4 className="font-medium mb-3 text-center">Appearance</h4>
                <div className="flex justify-center gap-3">
                  {[
                    { id: "male", label: "Male", emoji: "👨" },
                    { id: "female", label: "Female", emoji: "👩" },
                    { id: "neutral", label: "Neutral", emoji: "🧑" },
                  ].map(g => (
                    <button
                      key={g.id}
                      onClick={() => setGender(g.id as typeof gender)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        gender === g.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="mr-1">{g.emoji}</span>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Select Professional Style</h4>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {headshotStyles.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedStyle?.id === style.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-medium">{style.name}</div>
                      <div className="text-sm text-muted-foreground">{style.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleClearImage}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Change Photo
                </Button>
                <Button 
                  onClick={handleGenerate}
                  disabled={!selectedStyle}
                  className="bg-gradient-to-r from-violet-500 to-indigo-500"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Headshots
                </Button>
              </div>
            </div>
          )}

          {mode === "processing" && selectedStyle && (
            <ProcessingState
              progress={progress}
              message={`Creating ${selectedStyle.name} headshots...`}
              subMessage="Generating 4 professional variations"
            />
          )}

          {mode === "results" && resultImages.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative w-72 h-80 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={resultImages[selectedResult]}
                    alt="Generated headshot"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex justify-center gap-3">
                {resultImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedResult(idx)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedResult === idx
                        ? "border-primary ring-2 ring-primary/50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Option ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className="text-center">
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  👔 {selectedStyle?.name}
                </span>
              </div>
              
              <div className="flex justify-center gap-4">
                <DownloadButton 
                  imageUrl={resultImages[selectedResult]} 
                  filename={`headshot-${selectedStyle?.id || "pro"}.png`}
                  showShare
                />
                <Button variant="outline" onClick={handleStartOver}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Create More
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {mode === "upload" && (
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            { icon: "📸", title: "Upload Selfie", desc: "One clear photo is all you need" },
            { icon: "🎨", title: "Choose Style", desc: "Corporate, LinkedIn, Creative & more" },
            { icon: "✨", title: "Get 4 Headshots", desc: "Professional variations in seconds" },
          ].map((item, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-muted-foreground">{item.desc}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
