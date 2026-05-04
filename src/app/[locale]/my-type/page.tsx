"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { useLocale, useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

type Preset = {
  id: string;
  labelKey: string;
  prompt: string;
};

const PRESETS: Preset[] = [
  {
    id: "muscular",
    labelKey: "presets.muscular",
    prompt:
      "athletic, fit, toned physique, wearing a fitted athletic tank top, gym/fitness vibe, clean natural lighting",
  },
  {
    id: "streetwear",
    labelKey: "presets.streetwear",
    prompt:
      "modern streetwear outfit, oversized hoodie or jacket, trendy accessories, urban background, cinematic lighting",
  },
  {
    id: "old-money",
    labelKey: "presets.oldMoney",
    prompt:
      "old money aesthetic, quiet luxury, tailored outfit, classic watch, subtle colors, country club vibe, natural daylight",
  },
  {
    id: "cyberpunk",
    labelKey: "presets.cyberpunk",
    prompt:
      "cyberpunk fashion, neon rim lighting, futuristic outfit, techwear, night city background, high contrast",
  },
  {
    id: "kpop",
    labelKey: "presets.kpop",
    prompt:
      "K-pop idol style, trendy layered outfit, glossy studio lighting, clean background, fashion editorial",
  },
  {
    id: "beach",
    labelKey: "presets.beach",
    prompt:
      "beach vacation style, summer outfit, warm golden hour lighting, ocean background, candid lifestyle photo",
  },
];

export default function MyTypePage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [preset, setPreset] = useState<string>(PRESETS[0].id);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations("myType");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const localizedHref = (path: string) => `/${locale}${path}`;

  const selectedPreset = useMemo(
    () => PRESETS.find((p) => p.id === preset) || PRESETS[0],
    [preset]
  );

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError(null);
    setResults([]);

    try {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(`Failed to read file: ${msg}`);
      setProcessing(false);
      setProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleGenerate = async () => {
    if (!uploadedFile) return;
    setError(null);
    setProcessing(true);
    setProgress(0);

    const interval = setInterval(() => setProgress((p) => Math.min(p + 5, 90)), 400);

    try {
      const formData = new FormData();
      formData.append("image", uploadedFile);
      formData.append("gender", gender);
      formData.append("preset", selectedPreset.id);
      formData.append("presetPrompt", selectedPreset.prompt);

      const response = await fetch("/api/my-type", {
        method: "POST",
        body: formData,
      });

      let data: any = null;
      let rawText: string | null = null;
      const ct = response.headers.get("content-type") || "";
      try {
        if (ct.includes("application/json")) data = await response.json();
        else rawText = await response.text();
      } catch {
        // ignore
      }

      clearInterval(interval);
      setProgress(100);

      if (!response.ok || !data?.success) {
        const details = data?.error || data?.details || (rawText ? rawText.slice(0, 200) : "");
        throw new Error(
          details
            ? `Failed to generate (${response.status}): ${details}`
            : `Failed to generate (${response.status})`
        );
      }

      const imgs = Array.isArray(data.images) ? data.images : [];
      if (imgs.length === 0) throw new Error("No images returned from API");
      setResults(imgs);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
    } finally {
      clearInterval(interval);
      setProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href={localizedHref("")} className="flex items-center gap-2">
            <span className="text-2xl">📸</span>
            <span className="font-semibold">{tCommon("title")}</span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              {t("title")}
            </h1>
            <p className="text-gray-400 text-lg">{t("subtitle")}</p>
          </div>

          {/* Upload */}
          {!uploadedImage ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all ${
                isDragActive
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-6xl mb-6">✨</div>
              <h2 className="text-2xl font-semibold mb-2">{t("upload.title")}</h2>
              <p className="text-gray-400 mb-6">{t("upload.desc")}</p>
              <button className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all">
                {t("upload.cta")}
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: input + controls */}
              <div className="space-y-6">
                <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/5">
                  <img src={uploadedImage} alt="Upload" className="w-full h-80 object-cover" />
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-5">
                  <div>
                    <div className="text-sm text-gray-400 mb-2">{t("gender.label")}</div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setGender("male")}
                        className={`px-4 py-2 rounded-xl border transition ${
                          gender === "male"
                            ? "bg-white/15 border-white/20"
                            : "bg-transparent border-white/10 hover:border-white/20"
                        }`}
                      >
                        {t("gender.male")}
                      </button>
                      <button
                        onClick={() => setGender("female")}
                        className={`px-4 py-2 rounded-xl border transition ${
                          gender === "female"
                            ? "bg-white/15 border-white/20"
                            : "bg-transparent border-white/10 hover:border-white/20"
                        }`}
                      >
                        {t("gender.female")}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-2">{t("preset.label")}</div>
                    <div className="grid grid-cols-2 gap-3">
                      {PRESETS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setPreset(p.id)}
                          className={`px-4 py-3 rounded-2xl border text-left transition ${
                            preset === p.id
                              ? "bg-white/15 border-white/20"
                              : "bg-transparent border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="font-medium">{t(p.labelKey)}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={processing}
                    className={`w-full py-4 rounded-2xl font-semibold transition-all ${
                      processing
                        ? "bg-white/10 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:shadow-xl hover:shadow-violet-500/25"
                    }`}
                  >
                    {processing ? t("generating") : t("generate")}
                  </button>

                  {processing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{t("progress")}</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      setUploadedFile(null);
                      setResults([]);
                      setError(null);
                      setProgress(0);
                    }}
                    className="w-full py-3 rounded-2xl border border-white/10 hover:border-white/20 text-gray-300 transition"
                  >
                    {t("reset")}
                  </button>
                </div>

                {error && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
                    {error}
                  </div>
                )}
              </div>

              {/* Right: results */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">{t("results")}</h2>
                    {results.length > 0 && (
                      <span className="text-sm text-gray-400">
                        {t("resultCount", { count: results.length })}
                      </span>
                    )}
                  </div>

                  {results.length === 0 ? (
                    <div className="text-gray-400 text-sm">{t("resultsEmpty")}</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {results.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition"
                        >
                          <img src={url} alt={`Result ${idx + 1}`} className="w-full h-48 object-cover" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500 leading-relaxed">
                  {t("note")}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
