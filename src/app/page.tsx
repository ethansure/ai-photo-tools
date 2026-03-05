"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const tools = [
  { id: "pet-portrait", name: "Pet Portrait", emoji: "🐾", color: "from-amber-500 to-orange-600" },
  { id: "photo-restore", name: "Photo Restore", emoji: "📸", color: "from-blue-500 to-cyan-600" },
  { id: "photo-enhance", name: "Photo Enhance", emoji: "✨", color: "from-purple-500 to-pink-600" },
  { id: "background-remove", name: "BG Remove", emoji: "✂️", color: "from-green-500 to-emerald-600" },
  { id: "style-transfer", name: "Style Transfer", emoji: "🎨", color: "from-rose-500 to-red-600" },
  { id: "ai-headshots", name: "AI Headshots", emoji: "👔", color: "from-slate-500 to-zinc-700" },
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % tools.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[128px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-conic from-violet-600/10 via-transparent to-fuchsia-600/10 rounded-full blur-3xl animate-spin-slow" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-lg shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/50 transition-shadow">
              📸
            </div>
            <span className="text-xl font-semibold tracking-tight">PhotoICU</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            {tools.slice(0, 3).map(t => (
              <Link key={t.id} href={`/${t.id}`} className="hover:text-white transition-colors">
                {t.name}
              </Link>
            ))}
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Floating badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-300">6 AI Tools • Free to Try</span>
          </div>

          {/* Main heading with gradient animation */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-[0.9] tracking-tight">
            <span className="block">Transform</span>
            <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Every Photo
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Professional AI photo editing.
            <br className="hidden md:block" />
            Pet portraits to headshots, restoration to enhancement.
          </p>

          {/* Tool Pills - Interactive */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {tools.map((tool, i) => (
              <Link
                key={tool.id}
                href={`/${tool.id}`}
                className={`group px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                  i === activeIndex
                    ? `bg-gradient-to-r ${tool.color} text-white shadow-lg scale-105`
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                <span className="mr-2">{tool.emoji}</span>
                {tool.name}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/pet-portrait"
              className="group relative px-8 py-4 bg-white text-black rounded-2xl font-semibold text-lg overflow-hidden transition-transform hover:scale-105"
            >
              <span className="relative z-10">Start Creating →</span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-fuchsia-200 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <a
              href="#tools"
              className="px-8 py-4 rounded-2xl font-medium text-gray-300 hover:text-white transition-colors"
            >
              Explore Tools ↓
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gray-500 to-transparent" />
        </div>
      </section>

      {/* Tools Showcase */}
      <section id="tools" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Six Tools.
              <br />
              <span className="text-gray-500">Infinite Possibilities.</span>
            </h2>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Pet Portrait - Large */}
            <Link href="/pet-portrait" className="group lg:col-span-2 lg:row-span-2 relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-amber-900/50 to-orange-900/50 border border-white/10 p-8 min-h-[400px] flex flex-col justify-end hover:border-amber-500/50 transition-colors">
              <div className="absolute top-6 right-6 text-6xl opacity-80">🐾</div>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800')] bg-cover bg-center opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500" />
              <div className="relative">
                <span className="text-amber-400 text-sm font-medium mb-2 block">Most Popular</span>
                <h3 className="text-3xl md:text-4xl font-bold mb-2">Pet Portrait AI</h3>
                <p className="text-gray-300 mb-4">Transform your furry friends into stunning artwork. 70+ styles.</p>
                <span className="inline-flex items-center text-amber-400 font-medium group-hover:gap-3 gap-2 transition-all">
                  Create Portrait <span>→</span>
                </span>
              </div>
            </Link>

            {/* Photo Restore */}
            <Link href="/photo-restore" className="group relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-white/10 p-6 min-h-[200px] flex flex-col justify-end hover:border-blue-500/50 transition-colors">
              <div className="absolute top-4 right-4 text-4xl opacity-80">📸</div>
              <h3 className="text-2xl font-bold mb-1">Photo Restore</h3>
              <p className="text-gray-400 text-sm">Repair old damaged photos</p>
            </Link>

            {/* Photo Enhance */}
            <Link href="/photo-enhance" className="group relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-white/10 p-6 min-h-[200px] flex flex-col justify-end hover:border-purple-500/50 transition-colors">
              <div className="absolute top-4 right-4 text-4xl opacity-80">✨</div>
              <h3 className="text-2xl font-bold mb-1">Photo Enhance</h3>
              <p className="text-gray-400 text-sm">4x upscale & sharpen</p>
            </Link>

            {/* Background Remove */}
            <Link href="/background-remove" className="group relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-white/10 p-6 min-h-[200px] flex flex-col justify-end hover:border-green-500/50 transition-colors">
              <div className="absolute top-4 right-4 text-4xl opacity-80">✂️</div>
              <h3 className="text-2xl font-bold mb-1">BG Remove</h3>
              <p className="text-gray-400 text-sm">One-click background removal</p>
            </Link>

            {/* Style Transfer */}
            <Link href="/style-transfer" className="group relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-rose-900/50 to-red-900/50 border border-white/10 p-6 min-h-[200px] flex flex-col justify-end hover:border-rose-500/50 transition-colors">
              <div className="absolute top-4 right-4 text-4xl opacity-80">🎨</div>
              <h3 className="text-2xl font-bold mb-1">Style Transfer</h3>
              <p className="text-gray-400 text-sm">Van Gogh, Monet & more</p>
            </Link>

            {/* AI Headshots */}
            <Link href="/ai-headshots" className="group relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-800/50 to-zinc-900/50 border border-white/10 p-6 min-h-[200px] flex flex-col justify-end hover:border-slate-500/50 transition-colors">
              <div className="absolute top-4 right-4 text-4xl opacity-80">👔</div>
              <h3 className="text-2xl font-bold mb-1">AI Headshots</h3>
              <p className="text-gray-400 text-sm">Professional portraits</p>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20">
            Three Steps.
            <span className="text-gray-500"> Done.</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Upload", desc: "Drop your photo or paste a URL", icon: "📤" },
              { step: "02", title: "Choose", desc: "Select style, options & settings", icon: "🎯" },
              { step: "03", title: "Download", desc: "Get your transformed image", icon: "⬇️" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-6xl mb-6">{item.icon}</div>
                <div className="text-violet-400 text-sm font-mono mb-2">{item.step}</div>
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            Ready?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Pick a tool and start transforming.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {tools.map(tool => (
              <Link
                key={tool.id}
                href={`/${tool.id}`}
                className={`px-6 py-3 rounded-xl bg-gradient-to-r ${tool.color} text-white font-medium hover:scale-105 transition-transform shadow-lg`}
              >
                {tool.emoji} {tool.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-sm">
              📸
            </div>
            <span className="font-semibold">PhotoICU</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/blog" className="hover:text-white transition">Blog</Link>
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
          </div>
          <div className="text-sm text-gray-600">
            © 2026 PhotoICU
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
