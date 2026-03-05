"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useDropzone } from "react-dropzone";

// Style gallery - showing what each style looks like (not fake before/after)
const styleGallery = [
  { style: "Royal Portrait", emoji: "👑", image: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400", desc: "Your pet as royalty" },
  { style: "Oil Painting", emoji: "🎨", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400", desc: "Classic fine art style" },
  { style: "Watercolor", emoji: "💧", image: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?w=400", desc: "Soft painted look" },
  { style: "Pop Art", emoji: "🔴", image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400", desc: "Bold colors & patterns" },
  { style: "Anime", emoji: "🌸", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400", desc: "Japanese animation" },
  { style: "Sketch", emoji: "✏️", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400", desc: "Hand-drawn pencil" },
];

const styleCategories = [
  { name: "Classic", styles: ["Royal Portrait", "Oil Painting", "Renaissance", "Watercolor"] },
  { name: "Modern", styles: ["Disney Pixar", "Anime", "Cartoon", "Pop Art"] },
  { name: "Fantasy", styles: ["Space Explorer", "Fantasy Hero", "Wizard", "Superhero"] },
  { name: "Seasonal", styles: ["Christmas", "Halloween", "Valentine", "Birthday"] },
];

const artStyles = [
  { id: "royal", name: "Royal Portrait", emoji: "👑" },
  { id: "disney", name: "Disney Pixar", emoji: "✨" },
  { id: "oil", name: "Oil Painting", emoji: "🎨" },
  { id: "watercolor", name: "Watercolor", emoji: "💧" },
  { id: "anime", name: "Anime", emoji: "🌸" },
  { id: "popart", name: "Pop Art", emoji: "🔴" },
  { id: "renaissance", name: "Renaissance", emoji: "🏛️" },
  { id: "cartoon", name: "Cartoon", emoji: "🎬" },
  { id: "fantasy", name: "Fantasy Hero", emoji: "⚔️" },
  { id: "space", name: "Space Explorer", emoji: "🚀" },
  { id: "vangogh", name: "Van Gogh", emoji: "🌻" },
  { id: "sketch", name: "Pencil Sketch", emoji: "✏️" },
];

export default function PetPortraitPage() {
  const [mode, setMode] = useState<"landing" | "create">("landing");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
  });

  const handleGenerate = async () => {
    if (!uploadedFile || !selectedStyle) return;
    setProcessing(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 5, 90));
    }, 300);

    try {
      const formData = new FormData();
      formData.append("image", uploadedFile);
      formData.append("style", selectedStyle);

      const response = await fetch("/api/pet-portrait", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      clearInterval(progressInterval);
      setProgress(100);

      if (data.success) {
        setResults(data.images);
      }
    } catch (error) {
      console.error(error);
    } finally {
      clearInterval(progressInterval);
      setProcessing(false);
    }
  };

  // Landing Page
  if (mode === "landing" && !uploadedImage) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Header */}
        <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">📸</span>
              <span className="font-semibold">PhotoICU</span>
            </Link>
            <button
              onClick={() => setMode("create")}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-amber-500/25 transition"
            >
              Create Now →
            </button>
          </div>
        </header>

        {/* Hero */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 rounded-full text-amber-400 text-sm mb-6">
                  🔥 Most Popular Tool
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  Turn Your Pet Into
                  <span className="block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    Stunning Artwork
                  </span>
                </h1>
                <p className="text-xl text-gray-400 mb-8">
                  Upload your pet photo, choose a style, and watch AI transform it into beautiful art. 
                  Perfect for gifts, prints, and memories.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setMode("create")}
                    className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-amber-500/25 transition"
                  >
                    🐾 Create Portrait — Free
                  </button>
                  <a href="#styles" className="px-8 py-4 rounded-2xl font-medium border border-white/20 hover:bg-white/10 transition">
                    View Styles
                  </a>
                </div>
                <div className="flex items-center gap-6 mt-8 text-sm text-gray-500">
                  <span>✓ No signup required</span>
                  <span>✓ 70+ styles</span>
                  <span>✓ HD downloads</span>
                </div>
              </div>
              
              {/* Sample pets to upload */}
              <div className="text-center">
                <p className="text-gray-400 mb-4">Upload any pet photo:</p>
                <div className="grid grid-cols-3 gap-3">
                  <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200" alt="Dog" className="rounded-2xl aspect-square object-cover" />
                  <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200" alt="Cat" className="rounded-2xl aspect-square object-cover" />
                  <img src="https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=200" alt="Hamster" className="rounded-2xl aspect-square object-cover" />
                </div>
                <p className="text-gray-500 text-sm mt-4">Dogs, cats, birds, hamsters & more!</p>
              </div>
            </div>
          </div>
        </section>

        {/* Style Gallery - Real examples of art styles */}
        <section id="styles" className="py-20 px-6 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Art Style Examples</h2>
            <p className="text-gray-400 text-center mb-12">See what each style looks like</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {styleGallery.map((item, i) => (
                <div key={i} className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/30 transition group">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.style}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{item.emoji}</span>
                      <span className="font-semibold">{item.style}</span>
                    </div>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Style Categories */}
        <section className="py-20 px-6 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">70+ Art Styles</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {styleCategories.map((cat, i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="font-bold text-lg mb-4 text-amber-400">{cat.name}</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    {cat.styles.map((style, j) => (
                      <li key={j}>• {style}</li>
                    ))}
                    <li className="text-gray-600">+ more...</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", icon: "📤", title: "Upload Pet Photo", desc: "Any clear photo of your pet" },
                { step: "2", icon: "🎨", title: "Choose Style", desc: "Pick from 70+ art styles" },
                { step: "3", icon: "⬇️", title: "Download Art", desc: "Get HD artwork instantly" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl mx-auto mb-4">
                    {item.icon}
                  </div>
                  <div className="text-amber-400 text-sm font-mono mb-2">Step {item.step}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Create?</h2>
            <p className="text-gray-400 mb-8">Upload your pet photo and see the magic</p>
            <button
              onClick={() => setMode("create")}
              className="px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl font-semibold text-xl hover:shadow-xl hover:shadow-amber-500/25 transition"
            >
              🐾 Start Creating — Free
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-white/5 text-center text-sm text-gray-600">
          <Link href="/" className="hover:text-white transition">← Back to PhotoICU</Link>
        </footer>
      </main>
    );
  }

  // Create Mode
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📸</span>
            <span className="font-semibold">PhotoICU</span>
          </Link>
          <span className="text-amber-400">🐾 Pet Portrait</span>
        </div>
      </header>

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Create Pet Portrait</h1>

          {/* Upload */}
          {!uploadedImage && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all ${
                isDragActive ? "border-amber-500 bg-amber-500/10" : "border-white/20 hover:border-amber-500/50 hover:bg-white/5"
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-6xl mb-4">🐾</div>
              <p className="text-xl mb-2">Drop your pet photo here</p>
              <p className="text-gray-500">or click to browse</p>
            </div>
          )}

          {/* Style Selection */}
          {uploadedImage && !processing && results.length === 0 && (
            <div className="space-y-8">
              <div className="flex justify-center">
                <img src={uploadedImage} alt="Your pet" className="max-h-64 rounded-2xl" />
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Choose Style</h2>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {artStyles.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-4 rounded-xl text-center transition-all ${
                        selectedStyle === style.id
                          ? "bg-amber-500 text-white"
                          : "bg-white/5 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      <div className="text-2xl mb-1">{style.emoji}</div>
                      <div className="text-xs">{style.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!selectedStyle}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition"
              >
                ✨ Generate Portrait
              </button>
            </div>
          )}

          {/* Processing */}
          {processing && (
            <div className="text-center py-16">
              <div className="text-6xl mb-6 animate-bounce">🎨</div>
              <h2 className="text-2xl font-bold mb-4">Creating your masterpiece...</h2>
              <div className="w-full max-w-md mx-auto bg-white/10 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-gray-500">{progress}%</p>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-center">Your Pet Portrait!</h2>
              <div className="grid grid-cols-2 gap-4">
                {results.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} alt={`Result ${i + 1}`} className="w-full rounded-xl" />
                    <button
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = img;
                        link.download = `pet-portrait-${i + 1}.png`;
                        link.click();
                      }}
                      className="absolute bottom-3 right-3 bg-black/70 backdrop-blur px-4 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition"
                    >
                      ⬇️ Download
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setResults([]); setUploadedImage(null); setSelectedStyle(null); }}
                className="w-full py-4 bg-white/10 rounded-xl font-medium hover:bg-white/20 transition"
              >
                Create Another Portrait
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
