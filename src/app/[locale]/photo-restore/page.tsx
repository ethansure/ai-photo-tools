"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const realExample = {
  before: "/examples/restore-before.jpg",
  after: "/examples/restore-after.jpg",
};

export default function PhotoRestorePage() {
  const [mode, setMode] = useState<"landing" | "create">("landing");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  type RestoreItem = {
    id: string;
    file: File;
    previewUrl: string;
    status: "ready" | "processing" | "done" | "error";
    progress: number;
    resultUrl?: string;
    error?: string;
  };

  const [items, setItems] = useState<RestoreItem[]>([]);

  // Restore Studio controls
  const [strength, setStrength] = useState(60);
  const [faceEnhance, setFaceEnhance] = useState(true);
  const [upscale, setUpscale] = useState(true);
  const [promptOverride, setPromptOverride] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const t = useTranslations("photoRestore");
  const tCommon = useTranslations("common");
  const tFooter = useTranslations("footer");
  const locale = useLocale();
  const localizedHref = (path: string) => `/${locale}${path}`;

  const capabilities = [
    { icon: "👤", nameKey: "face", descKey: "faceDesc" },
    { icon: "🔧", nameKey: "scratch", descKey: "scratchDesc" },
    { icon: "🎨", nameKey: "colorize", descKey: "colorizeDesc" },
  ];

  const features = [
    { icon: "👤", nameKey: "face", descKey: "faceDesc" },
    { icon: "🔧", nameKey: "scratch", descKey: "scratchDesc" },
    { icon: "🎨", nameKey: "color", descKey: "colorDesc" },
    { icon: "✨", nameKey: "noise", descKey: "noiseDesc" },
  ];

  const options = [
    { id: "face", icon: "👤" },
    { id: "scratch", icon: "🔧" },
    { id: "colorize", icon: "🎨" },
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    const newItems: RestoreItem[] = acceptedFiles.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(16).slice(2)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      status: "ready",
      progress: 0,
    }));

    // For SEO/UX continuity, still keep a single "uploadedImage" preview for the top area.
    if (!uploadedImage) {
      setUploadedImage(newItems[0].previewUrl);
    }

    setItems((prev) => [...newItems, ...prev].slice(0, 20));
  }, [uploadedImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 20,
  });

  const effectiveOptions = useMemo(() => {
    const opts: string[] = [];
    if (faceEnhance) opts.push("face");
    if (upscale) opts.push("upscale");
    return opts;
  }, [faceEnhance, upscale]);

  const restoreOne = useCallback(async (itemId: string) => {
    const item = items.find((x) => x.id === itemId);
    if (!item) return;

    setItems((prev) => prev.map((x) => (x.id === itemId ? { ...x, status: "processing", progress: 0, error: undefined } : x)));

    try {
      const formData = new FormData();
      formData.append("image", item.file);
      formData.append("options", JSON.stringify(effectiveOptions));
      formData.append("strength", String(strength));
      if (promptOverride.trim()) formData.append("prompt", promptOverride.trim());
      if (negativePrompt.trim()) formData.append("negativePrompt", negativePrompt.trim());

      const interval = setInterval(() => {
        setItems((prev) => prev.map((x) => (x.id === itemId && x.status === "processing" ? { ...x, progress: Math.min(x.progress + 10, 90) } : x)));
      }, 400);

      const response = await fetch("/api/restore", { method: "POST", body: formData });
      const data = await response.json();
      clearInterval(interval);

      if (!data?.success || !data?.image) {
        throw new Error(data?.error || "Restore failed");
      }

      setItems((prev) => prev.map((x) => (x.id === itemId ? { ...x, status: "done", progress: 100, resultUrl: data.image } : x)));

      // Also update the single-result view for backward compatibility.
      setResult(data.image);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setItems((prev) => prev.map((x) => (x.id === itemId ? { ...x, status: "error", progress: 0, error: msg } : x)));
    }
  }, [items, effectiveOptions, strength, promptOverride, negativePrompt]);

  const restoreAll = useCallback(async () => {
    const queue = items.filter((x) => x.status === "ready");
    if (!queue.length) return;

    setProcessing(true);
    setProgress(0);

    // Simple promise pool (concurrency=2)
    const concurrency = 2;
    let done = 0;
    const runNext = async (): Promise<void> => {
      const next = queue.shift();
      if (!next) return;
      await restoreOne(next.id);
      done += 1;
      setProgress(Math.round((done / (done + queue.length)) * 100));
      await runNext();
    };

    await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, () => runNext()));
    setProgress(100);
    setProcessing(false);
  }, [items, restoreOne]);

  if (mode === "landing" && !uploadedImage) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href={localizedHref("")} className="flex items-center gap-2">
              <span className="text-2xl">📸</span>
              <span className="font-semibold">{tCommon("title")}</span>
            </Link>
            <div className="flex items-center gap-4">
              <button onClick={() => setMode("create")} className="px-5 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full text-sm font-medium">
                {t("restoreNow")} →
              </button>
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        <section className="pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full text-blue-400 text-sm mb-6">
                📸 {t("badge")}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                {t("heroTitle")}
                <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {t("heroTitleHighlight")}
                </span>
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                {t("heroSubtitle")}
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => setMode("create")} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl font-semibold text-lg">
                  📸 {t("restoreFree")}
                </button>
              </div>
            </div>
            
            {/* Real Before/After */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6">
              <p className="text-sm text-blue-400 mb-3 text-center">✨ {t("realResult")}</p>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1 text-center">{tCommon("before")}</p>
                  <img src={realExample.before} alt="Before" className="w-full aspect-square object-cover rounded-xl" />
                </div>
                <div className="text-2xl">→</div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1 text-center">{tCommon("after")}</p>
                  <img src={realExample.after} alt="After" className="w-full aspect-square object-cover rounded-xl" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {capabilities.map((cap, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-xl">{cap.icon}</div>
                  <div>
                    <div className="font-medium text-sm">{t(`features.${cap.nameKey}`)}</div>
                    <div className="text-xs text-gray-500">{t(`features.${cap.descKey}`)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">{t("features.title")}</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <div key={i} className="text-center bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="font-bold mb-2">{t(`features.${f.nameKey}`)}</h3>
                  <p className="text-sm text-gray-500">{t(`features.${f.descKey}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">{t("restoreMemories")}</h2>
            <button onClick={() => setMode("create")} className="px-10 py-5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl font-semibold text-xl">
              📸 {t("startRestoration")}
            </button>
          </div>
        </section>

        <footer className="py-8 px-6 border-t border-white/5 text-center text-sm text-gray-600">
          <Link href={localizedHref("")} className="hover:text-white transition">← {tFooter("backTo")} {tCommon("title")}</Link>
        </footer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href={localizedHref("")} className="flex items-center gap-2">
            <span className="text-2xl">📸</span>
            <span className="font-semibold">{tCommon("title")}</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-blue-400">📸 {t("title")}</span>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">Restore Studio</h1>
          <p className="text-center text-gray-400 mb-8">Redesign: simple controls + optional advanced overrides + batch</p>

          {!uploadedImage && (
            <div {...getRootProps()} className={`border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all ${isDragActive ? "border-blue-500 bg-blue-500/10" : "border-white/20 hover:border-blue-500/50"}`}>
              <input {...getInputProps()} />
              <div className="text-6xl mb-4">📸</div>
              <p className="text-xl mb-2">Drop photos to restore</p>
              <p className="text-gray-500">Supports batch (up to 20 images)</p>
            </div>
          )}

          {uploadedImage && !processing && (
            <div className="space-y-8">
              <div className="flex justify-center">
                <img src={uploadedImage} alt="Your photo" className="max-h-64 rounded-2xl" />
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold">Restore strength</h2>
                    <span className="text-sm text-gray-400">{strength}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={strength}
                    onChange={(e) => setStrength(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-2">Higher strength applies stronger enhancement + upscale.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 bg-black/30 border border-white/10 rounded-xl p-4">
                    <input type="checkbox" checked={faceEnhance} onChange={() => setFaceEnhance((v) => !v)} className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Face enhancement</div>
                      <div className="text-xs text-gray-500">Best for portraits / family photos</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 bg-black/30 border border-white/10 rounded-xl p-4">
                    <input type="checkbox" checked={upscale} onChange={() => setUpscale((v) => !v)} className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Upscale</div>
                      <div className="text-xs text-gray-500">Sharper results (may increase processing time)</div>
                    </div>
                  </label>
                </div>

                <button
                  onClick={() => setShowAdvanced((v) => !v)}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  {showAdvanced ? "Hide" : "Show"} advanced overrides
                </button>

                {showAdvanced && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-300">Prompt override (optional)</label>
                      <textarea
                        value={promptOverride}
                        onChange={(e) => setPromptOverride(e.target.value)}
                        placeholder="Example: keep freckles, remove scratches only, preserve clothing details"
                        className="mt-2 w-full min-h-[90px] rounded-xl bg-black/40 border border-white/10 p-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-300">Negative prompt (optional)</label>
                      <input
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        placeholder="Example: cartoon, unrealistic, over-smooth"
                        className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 p-3 text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-2">Note: advanced prompts are logged for iteration; model support will improve over time.</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={restoreAll} className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl font-semibold text-lg">
                    ✨ Restore batch ({items.filter(i => i.status === "ready").length})
                  </button>
                  <div {...getRootProps()} className="flex-1 py-4 rounded-xl font-medium bg-white/10 border border-white/10 text-center cursor-pointer hover:bg-white/15">
                    <input {...getInputProps()} />
                    + Add more photos
                  </div>
                </div>
              </div>

              {items.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Queue</h3>
                  <div className="grid gap-3">
                    {items.map((it) => (
                      <div key={it.id} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-3">
                        <img src={it.previewUrl} alt={it.file.name} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{it.file.name}</div>
                          <div className="text-xs text-gray-500">
                            {it.status === "ready" && "Ready"}
                            {it.status === "processing" && `Processing… ${it.progress}%`}
                            {it.status === "done" && "Done"}
                            {it.status === "error" && `Error: ${it.error || "failed"}`}
                          </div>
                          {it.status === "processing" && (
                            <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full" style={{ width: `${it.progress}%` }} />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {it.status === "ready" && (
                            <button onClick={() => restoreOne(it.id)} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm">Restore</button>
                          )}
                          {it.status === "done" && it.resultUrl && (
                            <button
                              onClick={() => {
                                const a = document.createElement("a");
                                a.href = it.resultUrl!;
                                a.download = `restored-${it.file.name}`;
                                a.click();
                              }}
                              className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 text-sm"
                            >
                              Download
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {processing && (
            <div className="text-center py-16">
              <div className="text-6xl mb-6 animate-pulse">🔄</div>
              <h2 className="text-2xl font-bold mb-4">Restoring…</h2>
              <div className="w-full max-w-md mx-auto bg-white/10 rounded-full h-3 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">{tCommon("before")}</p>
                  <img src={uploadedImage!} alt="Before" className="w-full rounded-xl" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">{tCommon("after")}</p>
                  <img src={result} alt="After" className="w-full rounded-xl" />
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => { const a = document.createElement("a"); a.href = result; a.download = "restored.png"; a.click(); }} className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl font-semibold">
                  ⬇️ {tCommon("download")}
                </button>
                <button onClick={() => { setResult(null); setUploadedImage(null); }} className="flex-1 py-4 bg-white/10 rounded-xl font-medium">
                  {t("restoreAnother")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
