"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const tools = [
  { id: "pet-portrait", name: "Pet Portrait", emoji: "🐾", color: "from-amber-500 to-orange-600", image: "/examples/pet-royal-real.png" },
  { id: "photo-restore", name: "Photo Restore", emoji: "📸", color: "from-blue-500 to-cyan-600", image: "/examples/restore-after.png" },
  { id: "photo-enhance", name: "Photo Enhance", emoji: "✨", color: "from-purple-500 to-pink-600", image: "/examples/enhance-after.png" },
  { id: "background-remove", name: "BG Remove", emoji: "✂️", color: "from-green-500 to-emerald-600", image: "/examples/bg-remove-after.png" },
  { id: "style-transfer", name: "Style Transfer", emoji: "🎨", color: "from-rose-500 to-red-600", image: "/examples/style-after.png" },
  { id: "ai-headshots", name: "AI Headshots", emoji: "👔", color: "from-slate-500 to-zinc-700", image: "/examples/headshot-after.png" },
];

const showcaseImages = [
  { before: "/examples/pet-original.jpg", after: "/examples/pet-royal-real.png", label: "Pet → Royal Portrait" },
  { before: "/examples/pet-original.jpg", after: "/examples/pet-disney-real.png", label: "Pet → Disney Style" },
  { before: "/examples/style-before.jpg", after: "/examples/style-after.png", label: "Photo → Van Gogh" },
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredTool, setHoveredTool] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % showcaseImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Dramatic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-black to-black" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-lg shadow-lg shadow-violet-500/25">
              📸
            </div>
            <span className="text-xl font-bold tracking-tight">AI Photo Tools</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/pet-portrait" className="text-gray-400 hover:text-white transition">Pet Portrait</Link>
            <Link href="/photo-restore" className="text-gray-400 hover:text-white transition">Restore</Link>
            <Link href="/style-transfer" className="text-gray-400 hover:text-white transition">Style Transfer</Link>
          </nav>
        </div>
      </header>

      {/* Hero - Full Screen Visual */}
      <section className="relative min-h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 pt-24 pb-12 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              Powered by AI
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6">
              Turn Photos Into
              <span className="block mt-2 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent">
                Magic ✨
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-lg">
              Pet portraits, photo restoration, AI enhancement, 
              style transfer — professional results in seconds.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/pet-portrait"
                className="group px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-violet-500/25 hover:scale-105 transition-all"
              >
                🐾 Try Pet Portrait
              </Link>
              <Link
                href="#tools"
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-medium hover:bg-white/10 transition"
              >
                View All Tools
              </Link>
            </div>
          </div>

          {/* Right - Showcase */}
          <div className="relative">
            {/* Main showcase card */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-2 shadow-2xl">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                {/* Before/After slider effect */}
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 overflow-hidden border-r-2 border-white/50">
                    <img 
                      src={showcaseImages[activeIndex].before} 
                      alt="Before" 
                      className="w-[200%] h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 rounded-full text-xs font-medium">
                      Before
                    </div>
                  </div>
                  <div className="w-1/2 overflow-hidden">
                    <img 
                      src={showcaseImages[activeIndex].after} 
                      alt="After" 
                      className="w-[200%] h-full object-cover -ml-full"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-violet-600/90 rounded-full text-xs font-medium">
                      After
                    </div>
                  </div>
                </div>
                {/* Center divider */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-bold shadow-xl">
                  ↔
                </div>
              </div>
              {/* Label */}
              <div className="mt-3 px-2 pb-1 text-center">
                <span className="text-sm text-gray-400">{showcaseImages[activeIndex].label}</span>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl overflow-hidden border border-white/20 shadow-xl animate-float-slow">
              <img src="/examples/pet-disney-real.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-2xl overflow-hidden border border-white/20 shadow-xl animate-float-slow delay-1000">
              <img src="/examples/pet-oil-real.png" alt="" className="w-full h-full object-cover" />
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {showcaseImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === activeIndex ? "w-6 bg-violet-500" : "bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">6 Powerful AI Tools</h2>
            <p className="text-gray-400 text-lg">Click any tool to start transforming</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, i) => (
              <Link
                key={tool.id}
                href={`/${tool.id}`}
                className="group relative rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
                onMouseEnter={() => setHoveredTool(i)}
                onMouseLeave={() => setHoveredTool(null)}
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <img 
                    src={tool.image} 
                    alt={tool.name}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      hoveredTool === i ? "scale-110 opacity-60" : "scale-100 opacity-40"
                    }`}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${tool.color} opacity-50 mix-blend-overlay`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative p-8 min-h-[240px] flex flex-col justify-end">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                    {tool.emoji}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{tool.name}</h3>
                  <p className="text-gray-300 text-sm opacity-80">
                    {tool.id === "pet-portrait" && "70+ art styles for your pets"}
                    {tool.id === "photo-restore" && "Fix old & damaged photos"}
                    {tool.id === "photo-enhance" && "4x upscale & sharpen"}
                    {tool.id === "background-remove" && "One-click BG removal"}
                    {tool.id === "style-transfer" && "Van Gogh, Monet & more"}
                    {tool.id === "ai-headshots" && "Professional portraits"}
                  </p>
                  <div className={`mt-4 inline-flex items-center gap-2 text-sm font-medium transition-all ${
                    hoveredTool === i ? "gap-3" : ""
                  }`}>
                    Try Now <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Gallery */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Real AI Results</h2>
            <p className="text-gray-400 text-lg">Actual transformations from our tools</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { before: "/examples/pet-original.jpg", after: "/examples/pet-royal-real.png", tool: "Pet Portrait", style: "Royal" },
              { before: "/examples/restore-before.jpg", after: "/examples/restore-after.png", tool: "Photo Restore", style: "Enhanced" },
              { before: "/examples/style-before.jpg", after: "/examples/style-after.png", tool: "Style Transfer", style: "Van Gogh" },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 rounded-3xl p-4 border border-white/10">
                <div className="flex gap-2 mb-3">
                  <div className="flex-1 relative rounded-xl overflow-hidden">
                    <img src={item.before} alt="Before" className="w-full aspect-square object-cover" />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 rounded text-xs">Before</span>
                  </div>
                  <div className="flex items-center text-gray-500">→</div>
                  <div className="flex-1 relative rounded-xl overflow-hidden">
                    <img src={item.after} alt="After" className="w-full aspect-square object-cover" />
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-violet-600/90 rounded text-xs">After</span>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-sm text-gray-400">{item.tool}</span>
                  <span className="mx-2 text-gray-600">•</span>
                  <span className="text-sm text-violet-400">{item.style}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-8">
            <div className="px-6 py-2 bg-black rounded-full">
              <span className="text-sm font-medium bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Free to try • No sign-up required
              </span>
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Start Transforming
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Pick a tool and see the magic happen
          </p>
          <Link
            href="/pet-portrait"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-semibold text-xl hover:shadow-2xl hover:shadow-violet-500/30 hover:scale-105 transition-all"
          >
            🐾 Start with Pet Portrait
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📸</span>
            <span className="font-semibold">AI Photo Tools</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            {tools.slice(0, 4).map(t => (
              <Link key={t.id} href={`/${t.id}`} className="hover:text-white transition">{t.name}</Link>
            ))}
          </div>
          <div className="text-sm text-gray-600">© 2026</div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </main>
  );
}
