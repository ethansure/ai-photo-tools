"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useDropzone } from "react-dropzone";

const examples = [
  { before: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400", after: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400", style: "Royal Portrait", desc: "Majestic & regal" },
  { before: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400", after: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400", style: "Oil Painting", desc: "Classic fine art" },
  { before: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400", after: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400", style: "Disney Pixar", desc: "3D animated" },
  { before: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=400", after: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400", style: "Watercolor", desc: "Soft & dreamy" },
  { before: "https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?w=400", after: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=400", style: "Anime", desc: "Japanese style" },
  { before: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400", after: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400", style: "Pop Art", desc: "Warhol-inspired" },
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
                  70+ art styles. Royal portraits, Disney, anime, oil paintings & more. 
                  Perfect for gifts, prints, and memories.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setMode("create")}
                    className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-amber-500/25 transition"
                  >
                    🐾 Create Portrait — Free
                  </button>
                  <a href="#examples" className="px-8 py-4 rounded-2xl font-medium border border-white/20 hover:bg-white/10 transition">
                    View Examples
                  </a>
                </div>
                <div className="flex items-center gap-6 mt-8 text-sm text-gray-500">
                  <span>✓ No signup required</span>
                  <span>✓ 70+ styles</span>
                  <span>✓ HD downloads</span>
                </div>
              </div>
              
              {/* Hero Image Grid */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  {examples.slice(0, 4).map((ex, i) => (
                    <div 
                      key={i} 
                      className={`relative rounded-2xl overflow-hidden ${i === 0 ? "col-span-2" : ""}`}
                    >
                      <img 
                        src={ex.after} 
                        alt={ex.style}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur px-3 py-1 rounded-full text-xs">
                        {ex.style}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Style Categories */}
        <section className="py-20 px-6 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">70+ Art Styles</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {styleCategories.map((cat, i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="font-bold text-lg mb-4">{cat.name}</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    {cat.styles.map((style, j) => (
                      <li key={j}>• {style}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Examples */}
        <section id="examples" className="py-20 px-6 bg-gradient-to-b from-transparent via-amber-950/20 to-transparent">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Before & After</h2>
            <p className="text-gray-400 text-center mb-12">Real transformations from our users</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {examples.map((ex, i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:border-amber-500/30 transition">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={ex.before} alt="Before" className="w-20 h-20 rounded-xl object-cover" />
                    <div className="text-2xl">→</div>
                    <img src={ex.after} alt="After" className="w-20 h-20 rounded-xl object-cover" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{ex.style}</div>
                    <div className="text-sm text-gray-500">{ex.desc}</div>
                  </div>
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
                { step: "1", icon: "📤", title: "Upload", desc: "Drop your pet photo" },
                { step: "2", icon: "🎨", title: "Choose Style", desc: "Pick from 70+ styles" },
                { step: "3", icon: "⬇️", title: "Download", desc: "Get HD artwork" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl mx-auto mb-4">
                    {item.icon}
                  </div>
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
            <h2 className="text-4xl font-bold mb-6">Create Your Pet&apos;s Portrait</h2>
            <p className="text-gray-400 mb-8">Upload a photo and transform it into art</p>
            <button
              onClick={() => setMode("create")}
              className="px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl font-semibold text-xl hover:shadow-xl hover:shadow-amber-500/25 transition"
            >
              🐾 Start Creating — It&apos;s Free
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
              <h2 className="text-2xl font-bold text-center">Your Pet Portraits!</h2>
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
