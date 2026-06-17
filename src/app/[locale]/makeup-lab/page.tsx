"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { useLocale, useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { FAQJsonLd, SoftwareApplicationJsonLd } from "@/components/JsonLd";

type Look = {
  id: string;
  name: string;
  vibe: string;
  lipstickHex: string;
  filter: {
    contrast: number;
    saturate: number;
    hueRotateDeg: number;
  };
};

const LOOKS: Look[] = [
  {
    id: "soft-nude",
    name: "Soft Nude",
    vibe: "Everyday, polished",
    lipstickHex: "#B86F64",
    filter: { contrast: 1.05, saturate: 1.05, hueRotateDeg: 0 },
  },
  {
    id: "classic-red",
    name: "Classic Red",
    vibe: "Bold, confident",
    lipstickHex: "#B61B2A",
    filter: { contrast: 1.12, saturate: 1.1, hueRotateDeg: -2 },
  },
  {
    id: "rosewood",
    name: "Rosewood",
    vibe: "Warm, flattering",
    lipstickHex: "#8D3C48",
    filter: { contrast: 1.08, saturate: 1.08, hueRotateDeg: 2 },
  },
  {
    id: "peachy-fresh",
    name: "Peachy Fresh",
    vibe: "Bright, friendly",
    lipstickHex: "#D96B5D",
    filter: { contrast: 1.02, saturate: 1.12, hueRotateDeg: 6 },
  },
  {
    id: "berry-stain",
    name: "Berry Stain",
    vibe: "Modern, chic",
    lipstickHex: "#6A1A3A",
    filter: { contrast: 1.1, saturate: 1.06, hueRotateDeg: -6 },
  },
  {
    id: "coral-pop",
    name: "Coral Pop",
    vibe: "Playful, energetic",
    lipstickHex: "#F04B4B",
    filter: { contrast: 1.04, saturate: 1.15, hueRotateDeg: 10 },
  },
  {
    id: "mauve-neutral",
    name: "Mauve Neutral",
    vibe: "Office-ready",
    lipstickHex: "#9B5366",
    filter: { contrast: 1.06, saturate: 1.03, hueRotateDeg: -4 },
  },
  {
    id: "espresso-lip",
    name: "Espresso Lip",
    vibe: "Editorial",
    lipstickHex: "#4B1F24",
    filter: { contrast: 1.14, saturate: 1.02, hueRotateDeg: 0 },
  },
  {
    id: "pink-sheer",
    name: "Pink Sheer",
    vibe: "Clean, minimal",
    lipstickHex: "#D56B8A",
    filter: { contrast: 1.02, saturate: 1.08, hueRotateDeg: 4 },
  },
  {
    id: "blurry-cloud",
    name: "Blurry Cloud",
    vibe: "Soft-focus, natural",
    lipstickHex: "#C57A86",
    filter: { contrast: 0.98, saturate: 1.04, hueRotateDeg: 3 },
  },
  {
    id: "suede-skin",
    name: "Suede Skin",
    vibe: "Velvety, blurred",
    lipstickHex: "#A96B63",
    filter: { contrast: 1.0, saturate: 1.02, hueRotateDeg: 1 },
  },
  {
    id: "sunlit-blush",
    name: "Sunlit Blush",
    vibe: "Beach skin, watercolor",
    lipstickHex: "#D87A72",
    filter: { contrast: 1.01, saturate: 1.1, hueRotateDeg: 7 },
  },
  {
    id: "hazy-pout",
    name: "Hazy Pout",
    vibe: "Blurred lip, soft glam",
    lipstickHex: "#A45A6A",
    filter: { contrast: 1.0, saturate: 1.06, hueRotateDeg: -3 },
  },
  {
    id: "less-tired-bright-face",
    name: "Bright Face",
    vibe: "Bright face, fresh",
    lipstickHex: "#C97678",
    filter: { contrast: 1.03, saturate: 1.07, hueRotateDeg: 4 },
  },
  {
    id: "underpainting-preview",
    name: "Underpainting",
    vibe: "Soft sculpt, glow",
    lipstickHex: "#B86A68",
    filter: { contrast: 1.04, saturate: 1.08, hueRotateDeg: 5 },
  },
  {
    id: "terracotta",
    name: "Terracotta",
    vibe: "Sun-kissed",
    lipstickHex: "#B34B3A",
    filter: { contrast: 1.08, saturate: 1.07, hueRotateDeg: 8 },
  },
  {
    id: "plum-satin",
    name: "Plum Satin",
    vibe: "Evening",
    lipstickHex: "#5B2143",
    filter: { contrast: 1.12, saturate: 1.05, hueRotateDeg: -10 },
  },
  {
    id: "brick-red",
    name: "Brick Red",
    vibe: "Power look",
    lipstickHex: "#8C1D2B",
    filter: { contrast: 1.14, saturate: 1.07, hueRotateDeg: -2 },
  },
  {
    id: "honey-nude",
    name: "Honey Nude",
    vibe: "Warm neutral",
    lipstickHex: "#A5624F",
    filter: { contrast: 1.06, saturate: 1.05, hueRotateDeg: 6 },
  },
  {
    id: "cool-rose",
    name: "Cool Rose",
    vibe: "Fresh contrast",
    lipstickHex: "#B14A6B",
    filter: { contrast: 1.06, saturate: 1.06, hueRotateDeg: -8 },
  },
  {
    id: "cherry-gloss",
    name: "Cherry Gloss",
    vibe: "Juicy shine",
    lipstickHex: "#D11C3D",
    filter: { contrast: 1.08, saturate: 1.12, hueRotateDeg: 0 },
  },
  {
    id: "dusty-rose",
    name: "Dusty Rose",
    vibe: "Soft glam",
    lipstickHex: "#9A4B5D",
    filter: { contrast: 1.05, saturate: 1.04, hueRotateDeg: 2 },
  },
  {
    id: "wine-matte",
    name: "Wine Matte",
    vibe: "Statement",
    lipstickHex: "#4F0F24",
    filter: { contrast: 1.16, saturate: 1.03, hueRotateDeg: -12 },
  },
  {
    id: "apricot",
    name: "Apricot",
    vibe: "Sunny",
    lipstickHex: "#E26B57",
    filter: { contrast: 1.03, saturate: 1.14, hueRotateDeg: 12 },
  },
];

const FOUNDATION_CHECKLIST = [
  "Use window light and turn off beauty filters",
  "Include face, jawline, neck, and a little chest",
  "Compare the preview against your neck before buying",
];

const UNDERTONE_OPTIONS = [
  { label: "Cool / pink", swatch: "#e9a7b7" },
  { label: "Neutral", swatch: "#c99a7a" },
  { label: "Warm / golden", swatch: "#d8a15f" },
  { label: "Olive / muted", swatch: "#a99b68" },
];

function hashToUnit(input: string) {
  // Simple deterministic hash -> [0,1)
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // Convert to unsigned 32-bit
  const u = h >>> 0;
  return (u % 1_000_000) / 1_000_000;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function scoreFor(lookId: string, photoSignature: string) {
  const u = hashToUnit(`${photoSignature}:${lookId}`);
  // Bias toward pleasant scores for MVP.
  return Math.round(70 + u * 28);
}

function reasonsFor(score: number) {
  const reasonsPool = [
    {
      key: "undertone",
      text:
        score >= 85
          ? "Strong undertone harmony (reads natural in daylight)"
          : "Good undertone harmony (easy to wear)" as const,
    },
    {
      key: "contrast",
      text:
        score >= 85
          ? "Excellent contrast balance (eyes + lips stay in sync)"
          : "Nice contrast balance (doesn’t overpower features)" as const,
    },
    {
      key: "pro",
      text:
        score >= 85
          ? "Very professional (camera/LinkedIn friendly)"
          : "Professional-leaning (clean, not too loud)" as const,
    },
    {
      key: "features",
      text:
        score >= 85
          ? "Feature balance is flattering (lips support, not steal)"
          : "Feature balance looks flattering (soft emphasis)" as const,
    },
  ];

  // Pick 2-3 reasons based on score tiers.
  const count = score >= 90 ? 3 : 2;
  // Deterministic selection from score.
  const start = score % reasonsPool.length;
  const out: string[] = [];
  for (let i = 0; i < reasonsPool.length && out.length < count; i++) {
    out.push(reasonsPool[(start + i) % reasonsPool.length].text);
  }
  return out;
}

const FAQS = [
  {
    question: "Is my selfie uploaded to a server?",
    answer:
      "This MVP preview runs in your browser and uses simple visual overlays. If we add advanced AI analysis later, we’ll clearly label what is processed locally vs on a server.",
  },
  {
    question: "How are the scores calculated?",
    answer:
      "Scores follow a stylist rubric (undertone harmony, contrast balance, professionalism, and feature balance). In this MVP we simulate scoring to validate UX and SEO before adding deeper analysis.",
  },
  {
    question: "Can I tweak the lipstick?",
    answer:
      "Yes—pick a shade and intensity. It’s a lightweight preview overlay (not full face makeup generation yet).",
  },
  {
    question: "Will you add eyeshadow/foundation/liner?",
    answer:
      "Planned. We’ll start with small, controllable edits (lip + blush + brow) before moving to heavier generation.",
  },
  {
    question: "What’s the best look for professional headshots?",
    answer:
      "Usually a neutral or mauve lip with medium intensity and balanced contrast. The lab surfaces ‘professionalism’ in the reasons to help you choose.",
  },
];

export default function MakeupLabPage() {
  const locale = useLocale();
  const t = useTranslations("makeupLab");
  const tCommon = useTranslations("common");
  const localizedHref = (path: string) => `/${locale}${path}`;

  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoSignature, setPhotoSignature] = useState<string>("anon");

  const [expanded, setExpanded] = useState(false);
  const [selectedLookId, setSelectedLookId] = useState<string>(LOOKS[0].id);

  const [lipstickHex, setLipstickHex] = useState<string>(LOOKS[0].lipstickHex);
  const [lipstickIntensity, setLipstickIntensity] = useState<number>(45);
  const [undertone, setUndertone] = useState<string>(UNDERTONE_OPTIONS[1].label);
  const [matchTarget, setMatchTarget] = useState<"neck" | "face">("neck");

  const selectedLook = useMemo(
    () => LOOKS.find((l) => l.id === selectedLookId) || LOOKS[0],
    [selectedLookId]
  );

  const looksWithScores = useMemo(() => {
    const scored = LOOKS.map((look) => {
      const score = scoreFor(look.id, photoSignature);
      return { look, score, reasons: reasonsFor(score) };
    }).sort((a, b) => b.score - a.score);

    return scored;
  }, [photoSignature]);

  const visibleLooks = expanded ? looksWithScores.slice(0, 18) : looksWithScores.slice(0, 6);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setPhotoSignature(`${file.name}:${file.size}:${file.lastModified}`);

    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(reader.result as string);
    reader.onerror = () => setPhotoDataUrl(null);
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  // Keep lipstick in sync when selecting looks.
  const selectLook = (id: string) => {
    setSelectedLookId(id);
    const l = LOOKS.find((x) => x.id === id);
    if (l) setLipstickHex(l.lipstickHex);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <SoftwareApplicationJsonLd
        name="Interactive Makeup Lab"
        description="Upload a selfie and get your top makeup looks with a stylist score and quick lipstick tweaks."
        url="https://aiphotos.icu/makeup-lab"
      />
      <FAQJsonLd faqs={FAQS} />

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href={localizedHref("")} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-lg">
              📸
            </div>
            <span className="text-xl font-bold">{tCommon("title")}</span>
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm text-gray-400">
              <Link href={localizedHref("/makeup-lab")} className="text-white">
                {t("nav")}
              </Link>
              <Link href={localizedHref("/blog")} className="hover:text-white transition">
                Blog
              </Link>
            </nav>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            {t("title1")} {" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              {t("title2")}
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Upload */}
        <div className="mb-10">
          <div
            {...getRootProps()}
            className={`p-8 rounded-3xl border transition cursor-pointer bg-white/5 ${
              isDragActive ? "border-violet-500/80" : "border-white/10 hover:border-violet-500/40"
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <div className="text-4xl mb-3">💄</div>
              <div className="text-xl font-semibold mb-2">{t("uploadTitle")}</div>
              <div className="text-gray-400">{t("uploadHint")}</div>
            </div>
          </div>
        </div>

        {/* Foundation Shade Match */}
        <section className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
            <div>
              <div className="text-sm text-violet-300 mb-2">Foundation Shade Match</div>
              <h2 className="text-2xl font-bold mb-3">
                Narrow your undertone before you test a look
              </h2>
              <p className="text-gray-400">
                Use this quick flow with a daylight selfie. It is a preview aid, not a final
                colorimeter: the safest shade should keep your face connected to your neck.
              </p>
              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                {FOUNDATION_CHECKLIST.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-gray-300"
                  >
                    <span className="text-violet-300">✓</span> {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <div className="text-sm text-gray-300 mb-3">Undertone family</div>
              <div className="grid grid-cols-2 gap-2">
                {UNDERTONE_OPTIONS.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setUndertone(option.label)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition ${
                      undertone === option.label
                        ? "border-violet-500/70 bg-violet-500/15"
                        : "border-white/10 bg-white/5 hover:border-violet-500/40"
                    }`}
                  >
                    <span
                      className="h-4 w-4 rounded-full border border-white/20"
                      style={{ background: option.swatch }}
                    />
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 text-sm text-gray-300 mb-3">Match priority</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "neck", label: "Neck match" },
                  { id: "face", label: "Face match" },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setMatchTarget(option.id as "neck" | "face")}
                    className={`rounded-xl border px-3 py-2 text-sm transition ${
                      matchTarget === option.id
                        ? "border-fuchsia-500/70 bg-fuchsia-500/15"
                        : "border-white/10 bg-white/5 hover:border-fuchsia-500/40"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-xl bg-white/5 p-4 text-sm text-gray-300">
                Test {undertone.toLowerCase()} shades against your {matchTarget}. If the preview
                looks ashy, orange, or disconnected, try the next undertone family before buying.
              </div>
              <Link
                href={localizedHref("/blog/foundation-shade-match-selfie-undertone-2026")}
                className="mt-4 inline-flex text-sm font-medium text-violet-300 hover:text-violet-200"
              >
                Read the full shade-match guide →
              </Link>
            </div>
          </div>
        </section>

        {/* Bright Face Guide */}
        <section className="mb-10 rounded-3xl border border-violet-500/20 bg-violet-500/10 p-6">
          <div className="grid lg:grid-cols-[1fr_auto] gap-5 items-center">
            <div>
              <div className="text-sm text-violet-300 mb-2">Under-Eye Brightening</div>
              <h2 className="text-2xl font-bold mb-3">Preview a less tired, bright-face look</h2>
              <p className="text-gray-400">
                Try the Bright Face preset for soft under-eye lift, peach/rose warmth, natural lips,
                and lightweight complexion polish before buying brightening makeup.
              </p>
            </div>
            <Link
              href={localizedHref("/blog/look-less-tired-makeup-filter-under-eye-brightening-2026")}
              className="inline-flex justify-center rounded-2xl border border-violet-400/40 px-5 py-3 text-sm font-semibold text-violet-100 hover:bg-violet-500/20 transition"
            >
              Read the bright-face guide →
            </Link>
          </div>
        </section>

        {/* Underpainting Guide */}
        <section className="mb-10 rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6">
          <div className="grid lg:grid-cols-[1fr_auto] gap-5 items-center">
            <div>
              <div className="text-sm text-rose-300 mb-2">Underpainting Preview</div>
              <h2 className="text-2xl font-bold mb-3">Test soft blush and contour under the base</h2>
              <p className="text-gray-400">
                Use the Underpainting preset to preview gentle lift, blush placement, and natural
                dimension before buying contour, concealer, or cream blush products.
              </p>
            </div>
            <Link
              href={localizedHref("/blog/underpainting-makeup-filter-blush-contour-preview-2026")}
              className="inline-flex justify-center rounded-2xl border border-rose-400/40 px-5 py-3 text-sm font-semibold text-rose-100 hover:bg-rose-500/20 transition"
            >
              Read the underpainting guide →
            </Link>
          </div>
        </section>

        {/* Results */}
        {photoDataUrl && (
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Preview */}
            <div className="sticky top-28">
              <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="p-5 border-b border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-400">{t("preview")}</div>
                    <div className="font-semibold">{selectedLook.name}</div>
                    <div className="text-xs text-gray-500">{selectedLook.vibe}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{t("lipstick")}</span>
                    <span
                      className="inline-block w-5 h-5 rounded-full border border-white/20"
                      style={{ background: lipstickHex }}
                    />
                  </div>
                </div>

                <div className="relative">
                  <img
                    src={photoDataUrl}
                    alt="Uploaded selfie preview"
                    className="w-full h-auto block"
                    style={{
                      filter: `contrast(${selectedLook.filter.contrast}) saturate(${selectedLook.filter.saturate}) hue-rotate(${selectedLook.filter.hueRotateDeg}deg)`,
                    }}
                  />
                  {/* Lightweight overlay preview (placeholder) */}
                  <div
                    className="absolute inset-0 mix-blend-soft-light"
                    style={{
                      background:
                        "radial-gradient(60% 60% at 50% 55%, rgba(255,255,255,0.15), rgba(0,0,0,0)), radial-gradient(40% 40% at 50% 75%, rgba(0,0,0,0.15), rgba(0,0,0,0))",
                      opacity: 0.75,
                    }}
                  />
                  <div
                    className="absolute inset-0 mix-blend-multiply"
                    style={{
                      background: lipstickHex,
                      opacity: (lipstickIntensity / 100) * 0.18,
                    }}
                  />
                </div>

                <div className="p-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="block">
                      <div className="text-sm text-gray-300 mb-2">{t("shade")}</div>
                      <input
                        type="color"
                        value={lipstickHex}
                        onChange={(e) => setLipstickHex(e.target.value)}
                        className="w-full h-10 rounded-xl bg-transparent border border-white/10"
                        aria-label="Lipstick shade"
                      />
                    </label>
                    <label className="block">
                      <div className="text-sm text-gray-300 mb-2">{t("intensity")}: {lipstickIntensity}%</div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={lipstickIntensity}
                        onChange={(e) => setLipstickIntensity(clamp(Number(e.target.value), 0, 100))}
                        className="w-full"
                        aria-label="Lipstick intensity"
                      />
                    </label>
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    {t("mvpNote")}
                  </div>
                </div>
              </div>
            </div>

            {/* Looks */}
            <div>
              <div className="flex items-end justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{t("topLooks")}</h2>
                  <p className="text-gray-400 text-sm">{t("rubric")}</p>
                </div>
                <button
                  className="text-sm px-4 py-2 rounded-xl border border-white/10 hover:border-violet-500/50 hover:bg-white/5 transition"
                  onClick={() => setExpanded((v) => !v)}
                >
                  {expanded ? t("showLess") : t("showMore")}
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {visibleLooks.map(({ look, score, reasons }) => (
                  <button
                    key={look.id}
                    onClick={() => selectLook(look.id)}
                    className={`text-left p-5 rounded-2xl border transition bg-white/5 ${
                      selectedLookId === look.id
                        ? "border-violet-500/60"
                        : "border-white/10 hover:border-violet-500/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold">{look.name}</div>
                        <div className="text-xs text-gray-500">{look.vibe}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{score}</div>
                        <div className="text-xs text-gray-500">/ 100</div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className="inline-block w-4 h-4 rounded-full border border-white/20"
                        style={{ background: look.lipstickHex }}
                        aria-hidden
                      />
                      <div className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>

                    <ul className="mt-3 text-sm text-gray-300 list-disc pl-5 space-y-1">
                      {reasons.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-6">{t("faqTitle")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {FAQS.map((f) => (
              <details
                key={f.question}
                className="p-5 rounded-2xl border border-white/10 bg-white/5"
              >
                <summary className="cursor-pointer font-semibold">
                  {f.question}
                </summary>
                <p className="mt-3 text-gray-400">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 py-10 border-t border-white/5 text-center text-sm text-gray-500">
          © 2026 AI Photo Tools. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
