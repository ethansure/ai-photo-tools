"use client";

import Link from "next/link";

const tools = [
  {
    id: "pet-portrait",
    name: "Pet Portrait AI",
    emoji: "🐾",
    description: "Transform your pet into stunning artwork",
    features: ["50+ Art Styles", "Royal, Disney, Oil Painting", "Print-Ready HD"],
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-50 to-orange-50",
    href: "/create",
    status: "live",
    popular: true,
  },
  {
    id: "photo-restore",
    name: "Photo Restoration",
    emoji: "📸",
    description: "Restore and colorize old damaged photos",
    features: ["Scratch Removal", "AI Colorization", "Face Enhancement"],
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    href: "#",
    status: "coming",
  },
  {
    id: "photo-enhance",
    name: "Photo Enhancer",
    emoji: "✨",
    description: "Upscale and enhance image quality",
    features: ["4x Upscaling", "Noise Reduction", "Detail Enhancement"],
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
    href: "#",
    status: "coming",
  },
  {
    id: "background-remove",
    name: "Background Remover",
    emoji: "🎭",
    description: "Remove or replace image backgrounds instantly",
    features: ["1-Click Remove", "Custom Backgrounds", "Batch Processing"],
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
    href: "#",
    status: "coming",
  },
  {
    id: "style-transfer",
    name: "Style Transfer",
    emoji: "🎨",
    description: "Apply artistic styles to your photos",
    features: ["Van Gogh, Monet", "Anime & Cartoon", "Abstract Art"],
    gradient: "from-red-500 to-rose-500",
    bgGradient: "from-red-50 to-rose-50",
    href: "#",
    status: "coming",
  },
  {
    id: "headshot",
    name: "AI Headshots",
    emoji: "👔",
    description: "Professional headshots for LinkedIn & business",
    features: ["Professional Lighting", "Multiple Outfits", "Corporate Ready"],
    gradient: "from-slate-600 to-slate-800",
    bgGradient: "from-slate-50 to-gray-100",
    href: "#",
    status: "coming",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🖼️</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              AI Photo Tools
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#tools" className="text-gray-600 hover:text-violet-600 transition">Tools</a>
            <Link href="/blog" className="text-gray-600 hover:text-violet-600 transition">Blog</Link>
          </nav>
          <Link 
            href="/create"
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:shadow-lg transition"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>🚀</span> AI-Powered Photo Tools Suite
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your Photos
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              With AI Magic
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Professional AI photo tools for everyone. Pet portraits, photo restoration, 
            enhancement, and more — all in one place.
          </p>

          {/* Stats */}
          <div className="flex justify-center items-center gap-12 mb-16 flex-wrap">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">100K+</div>
              <div className="text-gray-500">Photos Created</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">6</div>
              <div className="text-gray-500">AI Tools</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">4.9⭐</div>
              <div className="text-gray-500">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Our AI Tools</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Choose the perfect tool for your photo editing needs
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className={`relative rounded-3xl p-6 bg-gradient-to-br ${tool.bgGradient} border border-gray-100 hover:shadow-xl transition-all hover:scale-[1.02] group`}
              >
                {tool.popular && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    🔥 POPULAR
                  </div>
                )}
                {tool.status === "coming" && (
                  <div className="absolute -top-3 -right-3 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">
                    COMING SOON
                  </div>
                )}
                
                <div className="text-5xl mb-4">{tool.emoji}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tool.name}</h3>
                <p className="text-gray-600 mb-4">{tool.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {tool.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className={`w-5 h-5 rounded-full bg-gradient-to-r ${tool.gradient} flex items-center justify-center text-white text-xs`}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {tool.status === "live" ? (
                  <Link
                    href={tool.href}
                    className={`block w-full text-center py-3 rounded-xl bg-gradient-to-r ${tool.gradient} text-white font-semibold hover:shadow-lg transition`}
                  >
                    Try Now — Free
                  </Link>
                ) : (
                  <button
                    disabled
                    className="block w-full text-center py-3 rounded-xl bg-gray-200 text-gray-500 font-semibold cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-b from-violet-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, icon: "📤", title: "Upload Photo", desc: "Drop your image or paste a URL" },
              { step: 2, icon: "🎯", title: "Choose Tool", desc: "Select the AI tool you need" },
              { step: 3, icon: "✨", title: "Get Results", desc: "Download your transformed image" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg">
                  {item.icon}
                </div>
                <div className="text-sm text-violet-600 font-medium mb-2">Step {item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-violet-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Photos?</h2>
          <p className="text-xl mb-8 opacity-90">Start with our most popular tool — Pet Portrait AI</p>
          <Link 
            href="/create"
            className="inline-block bg-white text-violet-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition"
          >
            🐾 Create Pet Portrait — Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🖼️</span>
                <span className="text-xl font-bold text-white">AI Photo Tools</span>
              </div>
              <p className="text-sm">Professional AI-powered photo editing tools for everyone.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Tools</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/create" className="hover:text-white transition">Pet Portrait AI</Link></li>
                <li><span className="opacity-50">Photo Restoration</span></li>
                <li><span className="opacity-50">Photo Enhancer</span></li>
                <li><span className="opacity-50">Background Remover</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            © 2026 AI Photo Tools. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
