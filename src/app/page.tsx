"use client";

import Link from "next/link";
import Image from "next/image";

// Example images for each tool
const examples = {
  petPortrait: [
    { before: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400", after: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400", style: "Royal" },
    { before: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400", after: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400", style: "Oil Painting" },
    { before: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400", after: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400", style: "Disney" },
  ],
  restore: [
    { before: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&sat=-100&blur=1", after: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400" },
  ],
  headshot: [
    { before: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", after: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400" },
  ],
};

const tools = [
  {
    id: "pet-portrait",
    name: "Pet Portrait AI",
    tagline: "Turn your pet into art",
    emoji: "🐾",
    description: "70+ stunning art styles from Royal to Disney",
    image: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    href: "/pet-portrait",
    hot: true,
    stats: "50K+ pets transformed",
  },
  {
    id: "photo-restore",
    name: "Photo Restore",
    tagline: "Bring old photos back to life",
    emoji: "📸",
    description: "Fix scratches, enhance faces, colorize B&W",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600",
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    href: "/photo-restore",
    stats: "Restore any era",
  },
  {
    id: "photo-enhance",
    name: "Photo Enhance",
    tagline: "4x sharper, clearer, better",
    emoji: "✨",
    description: "AI upscaling with noise reduction",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
    href: "/photo-enhance",
    stats: "Up to 4x resolution",
  },
  {
    id: "background-remove",
    name: "Background Remove",
    tagline: "One click, clean cut",
    emoji: "✂️",
    description: "Instant removal, custom backgrounds",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    href: "/background-remove",
    stats: "< 5 seconds",
  },
  {
    id: "style-transfer",
    name: "Style Transfer",
    tagline: "Your photo, famous style",
    emoji: "🎨",
    description: "Van Gogh, Monet, Anime & more",
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600",
    gradient: "from-pink-500 via-rose-500 to-red-500",
    href: "/style-transfer",
    stats: "12 art styles",
  },
  {
    id: "ai-headshots",
    name: "AI Headshots",
    tagline: "LinkedIn-ready in seconds",
    emoji: "👔",
    description: "Professional portraits for business",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600",
    gradient: "from-slate-600 via-gray-700 to-zinc-800",
    href: "/ai-headshots",
    stats: "6 pro styles",
  },
];

const testimonials = [
  { name: "Sarah K.", text: "My dog looks like royalty! 👑", avatar: "🐕", tool: "Pet Portrait" },
  { name: "Mike T.", text: "Restored my grandma's 1950s photo perfectly", avatar: "👴", tool: "Photo Restore" },
  { name: "Lisa M.", text: "Got my LinkedIn headshot in 2 minutes", avatar: "👩‍💼", tool: "AI Headshots" },
  { name: "James R.", text: "4x upscale made my old photos printable!", avatar: "📷", tool: "Photo Enhance" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/80 backdrop-blur-xl z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xl">
              📸
            </div>
            <span className="text-2xl font-bold">PhotoICU</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <a href="#tools" className="hover:text-white transition">Tools</a>
            <a href="#examples" className="hover:text-white transition">Examples</a>
            <Link href="/blog" className="hover:text-white transition">Blog</Link>
          </nav>
          <Link 
            href="/pet-portrait"
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition"
          >
            Try Free →
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/50 via-black to-black pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-r from-violet-600/30 via-fuchsia-600/30 to-pink-600/30 blur-3xl rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm mb-6 border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              6 Professional AI Tools
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Transform Photos with
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                AI Magic ✨
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Pet portraits, photo restoration, enhancement, headshots & more.
              Professional results in seconds.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Link 
                href="/pet-portrait"
                className="group bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-violet-500/25 hover:scale-105 transition-all"
              >
                🐾 Create Pet Portrait
                <span className="ml-2 group-hover:ml-3 transition-all">→</span>
              </Link>
              <a 
                href="#tools"
                className="px-8 py-4 rounded-2xl font-semibold text-lg border border-white/20 hover:bg-white/10 transition"
              >
                View All Tools
              </a>
            </div>
          </div>

          {/* Hero Example Gallery */}
          <div className="relative">
            <div className="flex justify-center gap-4 md:gap-6">
              {examples.petPortrait.map((ex, i) => (
                <div 
                  key={i} 
                  className={`relative rounded-2xl overflow-hidden shadow-2xl transform transition-all hover:scale-105 hover:z-10 ${
                    i === 1 ? "w-48 h-64 md:w-64 md:h-80" : "w-36 h-48 md:w-48 md:h-64 opacity-80"
                  }`}
                >
                  <img src={ex.after} alt={ex.style} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">{ex.style}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-500 text-sm mt-6">↑ Real examples from Pet Portrait AI</p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-y border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { value: "100K+", label: "Photos Created" },
              { value: "70+", label: "Art Styles" },
              { value: "6", label: "AI Tools" },
              { value: "4.9★", label: "User Rating" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">All AI Tools</h2>
            <p className="text-gray-400 text-lg">Choose your transformation</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className="group relative rounded-3xl overflow-hidden bg-gradient-to-b from-white/10 to-white/5 border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02] hover:shadow-2xl"
              >
                {tool.hot && (
                  <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    🔥 HOT
                  </div>
                )}
                
                {/* Tool Image */}
                <div className="h-48 overflow-hidden">
                  <img 
                    src={tool.image} 
                    alt={tool.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${tool.gradient} opacity-60 mix-blend-multiply`} />
                </div>

                {/* Tool Info */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{tool.emoji}</span>
                    <div>
                      <h3 className="text-xl font-bold">{tool.name}</h3>
                      <p className="text-sm text-gray-400">{tool.tagline}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">{tool.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{tool.stats}</span>
                    <span className={`text-sm font-semibold bg-gradient-to-r ${tool.gradient} bg-clip-text text-transparent group-hover:translate-x-1 transition-transform`}>
                      Try Now →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Examples */}
      <section id="examples" className="py-24 px-4 bg-gradient-to-b from-transparent via-violet-950/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">See the Magic</h2>
            <p className="text-gray-400 text-lg">Real transformations, real results</p>
          </div>

          {/* Pet Portrait Examples */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">🐾 Pet Portrait Transformations</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {examples.petPortrait.map((ex, i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <img src={ex.before} alt="Before" className="w-full aspect-square object-cover rounded-xl" />
                      <span className="absolute bottom-2 left-2 text-xs bg-black/70 px-2 py-1 rounded-full">Original</span>
                    </div>
                    <div className="flex items-center text-2xl">→</div>
                    <div className="flex-1 relative">
                      <img src={ex.after} alt="After" className="w-full aspect-square object-cover rounded-xl" />
                      <span className="absolute bottom-2 left-2 text-xs bg-gradient-to-r from-violet-600 to-fuchsia-600 px-2 py-1 rounded-full">{ex.style}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link 
              href="/pet-portrait"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-violet-500/25 transition"
            >
              Try Pet Portrait Free →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by Users</h2>
            <p className="text-gray-400 text-lg">Join thousands of happy customers</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="text-4xl mb-4">{t.avatar}</div>
                <p className="text-gray-300 mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{t.name}</span>
                  <span className="text-xs text-gray-500 bg-white/10 px-2 py-1 rounded-full">{t.tool}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-pink-600/20 blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform?</h2>
          <p className="text-xl text-gray-400 mb-10">Start creating amazing AI-powered photos today</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/pet-portrait"
              className="bg-white text-black px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition"
            >
              🐾 Pet Portrait
            </Link>
            <Link 
              href="/photo-restore"
              className="bg-white/10 border border-white/20 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 transition"
            >
              📸 Photo Restore
            </Link>
            <Link 
              href="/ai-headshots"
              className="bg-white/10 border border-white/20 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 transition"
            >
              👔 AI Headshots
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm">
                  📸
                </div>
                <span className="text-lg font-bold">PhotoICU</span>
              </div>
              <p className="text-sm text-gray-500">Professional AI photo tools for everyone.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Tools</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/pet-portrait" className="hover:text-white transition">Pet Portrait</Link></li>
                <li><Link href="/photo-restore" className="hover:text-white transition">Photo Restore</Link></li>
                <li><Link href="/photo-enhance" className="hover:text-white transition">Photo Enhance</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">More</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/background-remove" className="hover:text-white transition">Background Remove</Link></li>
                <li><Link href="/style-transfer" className="hover:text-white transition">Style Transfer</Link></li>
                <li><Link href="/ai-headshots" className="hover:text-white transition">AI Headshots</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
            © 2026 PhotoICU. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
