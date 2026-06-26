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
    id: "non-cakey-concealer",
    name: "Concealer Check",
    vibe: "Smooth under-eye",
    lipstickHex: "#C87870",
    filter: { contrast: 1.02, saturate: 1.04, hueRotateDeg: 2 },
  },
  {
    id: "dark-circle-corrector",
    name: "Color Corrector",
    vibe: "Dark circle prep",
    lipstickHex: "#C97866",
    filter: { contrast: 1.02, saturate: 1.05, hueRotateDeg: 5 },
  },
  {
    id: "dry-undereye-crease",
    name: "Dry Crease Check",
    vibe: "Hydrated under-eye",
    lipstickHex: "#BE766F",
    filter: { contrast: 0.99, saturate: 1.03, hueRotateDeg: 2 },
  },
  {
    id: "underpainting-preview",
    name: "Underpainting",
    vibe: "Soft sculpt, glow",
    lipstickHex: "#B86A68",
    filter: { contrast: 1.04, saturate: 1.08, hueRotateDeg: 5 },
  },
  {
    id: "undertone-fix",
    name: "Undertone Fix",
    vibe: "Foundation check",
    lipstickHex: "#BC746D",
    filter: { contrast: 1.02, saturate: 1.03, hueRotateDeg: -2 },
  },
  {
    id: "olive-undertone-check",
    name: "Olive Undertone",
    vibe: "Muted olive base",
    lipstickHex: "#9D6B5C",
    filter: { contrast: 1.01, saturate: 0.98, hueRotateDeg: -7 },
  },
  {
    id: "foundation-wear-test",
    name: "Wear Test",
    vibe: "Oxidation check",
    lipstickHex: "#A36A5E",
    filter: { contrast: 1.02, saturate: 0.99, hueRotateDeg: -4 },
  },
  {
    id: "sunscreen-pilling-check",
    name: "Pilling Check",
    vibe: "SPF base prep",
    lipstickHex: "#B06F62",
    filter: { contrast: 1.01, saturate: 1.01, hueRotateDeg: -1 },
  },
  {
    id: "bare-skin-base-check",
    name: "Bare Skin Check",
    vibe: "Less base, smoother",
    lipstickHex: "#AD7468",
    filter: { contrast: 0.99, saturate: 1.0, hueRotateDeg: 1 },
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

const SPF_DECISION_HELPER = [
  {
    issue: "Foundation rolls or balls up",
    preset: "Pilling Check",
    action: "Reduce layer weight and wait 15-20 minutes after SPF before pressing foundation on.",
    href: "/blog/foundation-sunscreen-pilling-check-selfie-filter-2026",
  },
  {
    issue: "SPF looks greasy or gray",
    preset: "Suede Skin",
    action: "Compare a less shiny tinted SPF direction against your neck in daylight.",
    href: "/blog/pore-blurring-tinted-sunscreen-under-makeup-selfie-filter-2026",
  },
  {
    issue: "Pores look clogged or bumpy",
    preset: "Bare Skin Check",
    action: "Separate sunscreen texture from foundation texture before buying another primer.",
    href: "/blog/spf-clogged-pores-under-makeup-selfie-filter-2026",
  },
  {
    issue: "Base looks good fresh, then separates",
    preset: "Wear Test",
    action: "Retake the same selfie after one hour and check nose, mouth, jawline, and forehead shine.",
    href: "/blog/oily-skin-sunscreen-under-makeup-wear-test-2026",
  },
  {
    issue: "SPF touch-up moves makeup",
    preset: "Wear Test",
    action: "Compare before-and-after selfies for powder, spray, stick, or cushion touch-ups over makeup.",
    href: "/blog/touch-up-sunscreen-over-makeup-selfie-filter-2026",
  },
];

const SPF_FINISH_COMPARISON = [
  {
    finish: "Matte SPF",
    bestFor: "Oil control, nose shine, and long workdays",
    risk: "Can catch on dry patches or make foundation drag if you skip skin prep.",
    href: "/blog/oily-skin-sunscreen-under-makeup-wear-test-2026",
  },
  {
    finish: "Pore-blurring tinted SPF",
    bestFor: "White cast, redness, and smoother no-foundation days",
    risk: "Can turn orange, gray, or too shiny once foundation sits on top.",
    href: "/blog/pore-blurring-tinted-sunscreen-under-makeup-selfie-filter-2026",
  },
  {
    finish: "Dewy SPF",
    bestFor: "Dry skin, glow, and flexible foundation",
    risk: "Can separate around pores or make powder look heavy on oily zones.",
    href: "/blog/spf-clogged-pores-under-makeup-selfie-filter-2026",
  },
];

const UNDER_EYE_ISSUE_SELECTOR = [
  {
    issue: "Dry creasing or fine lines",
    preset: "Dry Crease Check",
    action: "Compare thinner prep, lower concealer placement, and lighter powder before buying a fuller-coverage tube.",
    href: "/blog/dry-undereye-concealer-creasing-selfie-filter-2026",
  },
  {
    issue: "Blue, purple, brown, or gray circles",
    preset: "Color Corrector",
    action: "Test a peach, orange, yellow, or neutral corrector direction before layering more concealer.",
    href: "/blog/dark-circle-color-corrector-check-selfie-filter-2026",
  },
  {
    issue: "Cakey dark-circle coverage",
    preset: "Concealer Check",
    action: "Preview a smoother non-cakey coverage direction for dark circles, dark spots, and center-face brightness.",
    href: "/blog/non-cakey-concealer-dark-circles-dark-spots-selfie-filter-2026",
  },
  {
    issue: "SPF makes concealer sting, gray, or crease",
    preset: "Wear Test",
    action: "Compare eye-area SPF alone, fresh concealer, and one-hour wear before changing eye sunscreen or powder.",
    href: "/blog/under-eye-sunscreen-concealer-creasing-selfie-filter-2026",
  },
];

const LAYER_STACK_CHECKS = [
  {
    layer: "Skincare and SPF",
    preset: "Pilling Check",
    action: "Find out whether texture starts before foundation or only after the base goes on.",
    href: "/blog/foundation-sunscreen-pilling-check-selfie-filter-2026",
  },
  {
    layer: "Foundation only",
    preset: "Bare Skin Check",
    action: "Compare full coverage against a thinner spot-conceal direction when bare skin looks smoother.",
    href: "/blog/makeup-looks-worse-than-bare-skin-selfie-filter-2026",
  },
  {
    layer: "Concealer and fine lines",
    preset: "Dry Crease Check",
    action: "Check whether concealer amount, placement, or powder timing is making lines sharper.",
    href: "/blog/dry-undereye-concealer-creasing-selfie-filter-2026",
  },
  {
    layer: "Powder finish",
    preset: "Wear Test",
    action: "Use the one-hour photo to see whether powder, oil, or movement is breaking the base down.",
    href: "/blog/splotchy-makeup-settles-fine-lines-selfie-filter-2026",
  },
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
  {
    question: "How do I stop sunscreen from pilling under makeup?",
    answer:
      "Use the Pilling Check preset, keep SPF and primer layers thin, wait 15-20 minutes after sunscreen, and press foundation on instead of rubbing. If the preview still looks textured, compare the best-sunscreen and pilling guides before changing your foundation.",
  },
  {
    question: "Can Makeup Lab help when SPF makes pores look clogged?",
    answer:
      "Yes. Start with Bare Skin Check to see whether texture comes from sunscreen, primer, or foundation, then compare Suede Skin or Wear Test for a lighter base direction. The SPF decision helper links to the clogged-pores and tinted-SPF guides for the next step.",
  },
  {
    question: "Should I choose matte, dewy, or tinted sunscreen under makeup?",
    answer:
      "Choose by the problem you see in daylight selfies: matte SPF for oil control, pore-blurring tinted SPF for white cast or redness, and a dewier SPF only when dry patches matter more than shine. Compare the same foundation over each finish before changing primer and powder too.",
  },
  {
    question: "How should oily skin test sunscreen under makeup?",
    answer:
      "Take one selfie after SPF settles, one right after makeup, and one after an hour without touching up. Use Wear Test and Pilling Check to compare nose separation, forehead shine, pore texture, and powder patches before buying another matte SPF.",
  },
  {
    question: "How do I reapply sunscreen over makeup without ruining it?",
    answer:
      "Take one daylight selfie before touch-up and one after using SPF powder, spray, stick, cushion, or setting spray. Use Wear Test and Pilling Check to compare shine, patchiness, lifted concealer, nose separation, and powder texture before changing products.",
  },
  {
    question: "How should I test under-eye sunscreen with concealer?",
    answer:
      "Take one daylight selfie after eye-area SPF settles, one after concealer and powder, and one after an hour. Use Dry Crease Check, Concealer Check, and Wear Test to compare stinging, gray cast, pilling, creasing, and powder texture before buying another eye SPF or concealer.",
  },
  {
    question: "Which Makeup Lab preset should I use for under-eye makeup issues?",
    answer:
      "Use Dry Crease Check for fine lines and powder texture, Color Corrector for blue, purple, brown, or gray circles, Concealer Check for cakey coverage, and Wear Test when eye-area SPF changes how concealer sits after an hour.",
  },
  {
    question: "How do I find which makeup layer is causing splotchy texture?",
    answer:
      "Take the same daylight selfie after skincare and SPF, after foundation, after concealer, after powder, and after one hour. Use the Layer Stack Check to spot the first step where makeup looks splotchy or settles into fine lines.",
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
              <Link
                href={localizedHref("/blog/foundation-oxidation-wear-test-selfie-filter-2026")}
                className="mt-3 inline-flex text-sm font-medium text-violet-300 hover:text-violet-200"
              >
                Check foundation oxidation after an hour →
              </Link>
              <Link
                href={localizedHref("/blog/non-cakey-concealer-dark-circles-dark-spots-selfie-filter-2026")}
                className="mt-3 inline-flex text-sm font-medium text-violet-300 hover:text-violet-200"
              >
                Preview non-cakey concealer for dark circles →
              </Link>
            </div>
          </div>
        </section>

        {/* Foundation Wear Test Guide */}
        <section className="mb-10 rounded-3xl border border-orange-500/20 bg-orange-500/10 p-6">
          <div className="grid lg:grid-cols-[1fr_auto] gap-5 items-center">
            <div>
              <div className="text-sm text-orange-300 mb-2">Foundation Wear Test</div>
              <h2 className="text-2xl font-bold mb-3">Compare fresh vs one-hour oxidation</h2>
              <p className="text-gray-400">
                Use the Wear Test preset when a foundation looks right at first but turns orange,
                darker, or disconnected from your neck after setting.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href={localizedHref("/blog/foundation-oxidation-wear-test-selfie-filter-2026")}
                className="inline-flex justify-center rounded-2xl border border-orange-400/40 px-5 py-3 text-sm font-semibold text-orange-100 hover:bg-orange-500/20 transition"
              >
                Read the wear-test guide →
              </Link>
              <Link
                href={localizedHref("/blog/non-cakey-concealer-dark-circles-dark-spots-selfie-filter-2026")}
                className="inline-flex justify-center rounded-2xl border border-orange-400/30 px-5 py-3 text-sm font-semibold text-orange-100 hover:bg-orange-500/20 transition"
              >
                Check concealer creasing →
              </Link>
            </div>
          </div>
        </section>

        {/* Foundation and Sunscreen Pilling Guide */}
        <section className="mb-10 rounded-3xl border border-lime-500/20 bg-lime-500/10 p-6">
          <div className="grid lg:grid-cols-[1fr_auto] gap-5 items-center">
            <div>
              <div className="text-sm text-lime-300 mb-2">SPF and Primer Compatibility</div>
              <h2 className="text-2xl font-bold mb-3">Check foundation pilling over sunscreen</h2>
              <p className="text-gray-400">
                Use the Pilling Check preset when moisturizer, SPF, primer, foundation, or setting
                powder balls up, separates, or looks patchy after a few minutes of wear.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href={localizedHref("/blog/foundation-sunscreen-pilling-check-selfie-filter-2026")}
                className="inline-flex justify-center rounded-2xl border border-lime-400/40 px-5 py-3 text-sm font-semibold text-lime-100 hover:bg-lime-500/20 transition"
              >
                Read the pilling guide →
              </Link>
              <Link
                href={localizedHref("/blog/pore-blurring-tinted-sunscreen-under-makeup-selfie-filter-2026")}
                className="inline-flex justify-center rounded-2xl border border-lime-400/30 px-5 py-3 text-sm font-semibold text-lime-100 hover:bg-lime-500/20 transition"
              >
                Check tinted SPF blur →
              </Link>
              <Link
                href={localizedHref("/blog/spf-clogged-pores-under-makeup-selfie-filter-2026")}
                className="inline-flex justify-center rounded-2xl border border-lime-400/30 px-5 py-3 text-sm font-semibold text-lime-100 hover:bg-lime-500/20 transition"
              >
                Check SPF clogged pores →
              </Link>
              <Link
                href={localizedHref("/blog/oily-skin-sunscreen-under-makeup-wear-test-2026")}
                className="inline-flex justify-center rounded-2xl border border-lime-400/30 px-5 py-3 text-sm font-semibold text-lime-100 hover:bg-lime-500/20 transition"
              >
                Run oily-skin SPF wear test →
              </Link>
              <Link
                href={localizedHref("/blog/touch-up-sunscreen-over-makeup-selfie-filter-2026")}
                className="inline-flex justify-center rounded-2xl border border-lime-400/30 px-5 py-3 text-sm font-semibold text-lime-100 hover:bg-lime-500/20 transition"
              >
                Check SPF touch-ups over makeup →
              </Link>
              <Link
                href={localizedHref("/blog/under-eye-sunscreen-concealer-creasing-selfie-filter-2026")}
                className="inline-flex justify-center rounded-2xl border border-lime-400/30 px-5 py-3 text-sm font-semibold text-lime-100 hover:bg-lime-500/20 transition"
              >
                Check under-eye SPF with concealer →
              </Link>
              <Link
                href={localizedHref("/blog/splotchy-makeup-settles-fine-lines-selfie-filter-2026")}
                className="inline-flex justify-center rounded-2xl border border-lime-400/30 px-5 py-3 text-sm font-semibold text-lime-100 hover:bg-lime-500/20 transition"
              >
                Check splotchy fine-line settling →
              </Link>
              <Link
                href={localizedHref("/blog/makeup-looks-worse-than-bare-skin-selfie-filter-2026")}
                className="inline-flex justify-center rounded-2xl border border-lime-400/30 px-5 py-3 text-sm font-semibold text-lime-100 hover:bg-lime-500/20 transition"
              >
                Check if less base looks smoother →
              </Link>
              <Link
                href={localizedHref("/blog/foundation-oxidation-wear-test-selfie-filter-2026")}
                className="inline-flex justify-center rounded-2xl border border-lime-400/30 px-5 py-3 text-sm font-semibold text-lime-100 hover:bg-lime-500/20 transition"
              >
                Compare one-hour wear →
              </Link>
            </div>
          </div>

          <div className="mt-6 border-t border-lime-300/15 pt-6">
            <div className="text-sm text-lime-200 mb-3">SPF under makeup decision helper</div>
            <div className="grid md:grid-cols-2 gap-3">
              {SPF_DECISION_HELPER.map((item) => (
                <Link
                  key={item.issue}
                  href={localizedHref(item.href)}
                  className="rounded-2xl border border-lime-300/15 bg-black/20 p-4 transition hover:border-lime-300/40 hover:bg-lime-500/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-lime-50">{item.issue}</div>
                      <div className="mt-1 text-xs uppercase tracking-wide text-lime-200/80">
                        Try {item.preset}
                      </div>
                    </div>
                    <span className="text-lime-200" aria-hidden>
                      →
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-300">{item.action}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-lime-300/15 pt-6">
            <div className="text-sm text-lime-200 mb-3">SPF finish finder</div>
            <div className="grid md:grid-cols-3 gap-3">
              {SPF_FINISH_COMPARISON.map((item) => (
                <Link
                  key={item.finish}
                  href={localizedHref(item.href)}
                  className="rounded-2xl border border-lime-300/15 bg-black/20 p-4 transition hover:border-lime-300/40 hover:bg-lime-500/10"
                >
                  <div className="font-semibold text-lime-50">{item.finish}</div>
                  <p className="mt-2 text-sm text-gray-300">{item.bestFor}</p>
                  <p className="mt-3 text-xs text-lime-100/75">{item.risk}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-lime-300/15 pt-6">
            <div className="text-sm text-lime-200 mb-3">Layer Stack Check</div>
            <div className="grid md:grid-cols-2 gap-3">
              {LAYER_STACK_CHECKS.map((item) => (
                <Link
                  key={item.layer}
                  href={localizedHref(item.href)}
                  className="rounded-2xl border border-lime-300/15 bg-black/20 p-4 transition hover:border-lime-300/40 hover:bg-lime-500/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-lime-50">{item.layer}</div>
                      <div className="mt-1 text-xs uppercase tracking-wide text-lime-200/80">
                        Try {item.preset}
                      </div>
                    </div>
                    <span className="text-lime-200" aria-hidden>
                      →
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-300">{item.action}</p>
                </Link>
              ))}
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
            <div className="flex flex-col gap-3">
              <Link
                href={localizedHref("/blog/look-less-tired-makeup-filter-under-eye-brightening-2026")}
                className="inline-flex justify-center rounded-2xl border border-violet-400/40 px-5 py-3 text-sm font-semibold text-violet-100 hover:bg-violet-500/20 transition"
              >
                Read the bright-face guide →
              </Link>
              <Link
                href={localizedHref("/blog/non-cakey-concealer-dark-circles-dark-spots-selfie-filter-2026")}
                className="inline-flex justify-center rounded-2xl border border-violet-400/30 px-5 py-3 text-sm font-semibold text-violet-100 hover:bg-violet-500/20 transition"
              >
                Check non-cakey concealer →
              </Link>
            </div>
          </div>
        </section>

        {/* Concealer Check Guide */}
        <section className="mb-10 rounded-3xl border border-pink-500/20 bg-pink-500/10 p-6">
          <div className="grid lg:grid-cols-[1fr_auto] gap-5 items-center">
            <div>
              <div className="text-sm text-pink-300 mb-2">Concealer Texture Check</div>
              <h2 className="text-2xl font-bold mb-3">Test dark circles without a cakey finish</h2>
              <p className="text-gray-400">
                Use the Concealer Check preset to preview smoother under-eyes and dark-spot
                coverage before buying a brighter, thicker, or more matte concealer.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href={localizedHref("/blog/non-cakey-concealer-dark-circles-dark-spots-selfie-filter-2026")}
                className="inline-flex justify-center rounded-2xl border border-pink-400/40 px-5 py-3 text-sm font-semibold text-pink-100 hover:bg-pink-500/20 transition"
              >
                Read the concealer guide →
              </Link>
              <Link
                href={localizedHref("/blog/dark-circle-color-corrector-check-selfie-filter-2026")}
                className="inline-flex justify-center rounded-2xl border border-pink-400/30 px-5 py-3 text-sm font-semibold text-pink-100 hover:bg-pink-500/20 transition"
              >
                Pick a corrector shade →
              </Link>
              <Link
                href={localizedHref("/blog/dry-undereye-concealer-creasing-selfie-filter-2026")}
                className="inline-flex justify-center rounded-2xl border border-pink-400/30 px-5 py-3 text-sm font-semibold text-pink-100 hover:bg-pink-500/20 transition"
              >
                Check dry under-eye creasing →
              </Link>
            </div>
          </div>

          <div className="mt-6 border-t border-pink-300/15 pt-6">
            <div className="text-sm text-pink-200 mb-3">Under-eye issue selector</div>
            <div className="grid md:grid-cols-2 gap-3">
              {UNDER_EYE_ISSUE_SELECTOR.map((item) => (
                <Link
                  key={item.issue}
                  href={localizedHref(item.href)}
                  className="rounded-2xl border border-pink-300/15 bg-black/20 p-4 transition hover:border-pink-300/40 hover:bg-pink-500/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-pink-50">{item.issue}</div>
                      <div className="mt-1 text-xs uppercase tracking-wide text-pink-200/80">
                        Try {item.preset}
                      </div>
                    </div>
                    <span className="text-pink-200" aria-hidden>
                      →
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-300">{item.action}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Dry Under-Eye Guide */}
        <section className="mb-10 rounded-3xl border border-fuchsia-500/20 bg-fuchsia-500/10 p-6">
          <div className="grid lg:grid-cols-[1fr_auto] gap-5 items-center">
            <div>
              <div className="text-sm text-fuchsia-300 mb-2">Dry Under-Eye Creasing</div>
              <h2 className="text-2xl font-bold mb-3">Preview smoother concealer before powder</h2>
              <p className="text-gray-400">
                Use the Dry Crease Check preset when concealer settles into fine lines, looks dry
                after setting, or needs a thinner skincare-first approach. The guide now separates
                dryness from excess product, high placement, powder timing, and crease cleanout.
              </p>
            </div>
            <Link
              href={localizedHref("/blog/dry-undereye-concealer-creasing-selfie-filter-2026")}
              className="inline-flex justify-center rounded-2xl border border-fuchsia-400/40 px-5 py-3 text-sm font-semibold text-fuchsia-100 hover:bg-fuchsia-500/20 transition"
            >
              Read the dry under-eye guide →
            </Link>
          </div>
        </section>

        {/* Color Corrector Guide */}
        <section className="mb-10 rounded-3xl border border-sky-500/20 bg-sky-500/10 p-6">
          <div className="grid lg:grid-cols-[1fr_auto] gap-5 items-center">
            <div>
              <div className="text-sm text-sky-300 mb-2">Dark Circle Corrector</div>
              <h2 className="text-2xl font-bold mb-3">Preview peach, orange, or yellow correction</h2>
              <p className="text-gray-400">
                Use the Color Corrector preset before Concealer Check when blue, purple, brown, or
                gray under-eyes need a thinner prep layer instead of heavier concealer.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href={localizedHref("/blog/dark-circle-color-corrector-check-selfie-filter-2026")}
                className="inline-flex justify-center rounded-2xl border border-sky-400/40 px-5 py-3 text-sm font-semibold text-sky-100 hover:bg-sky-500/20 transition"
              >
                Read the corrector guide →
              </Link>
              <Link
                href={localizedHref("/blog/dry-undereye-concealer-creasing-selfie-filter-2026")}
                className="inline-flex justify-center rounded-2xl border border-sky-400/30 px-5 py-3 text-sm font-semibold text-sky-100 hover:bg-sky-500/20 transition"
              >
                Fix dry concealer texture →
              </Link>
            </div>
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

        {/* Undertone Fix Guide */}
        <section className="mb-10 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6">
          <div className="grid lg:grid-cols-[1fr_auto] gap-5 items-center">
            <div>
              <div className="text-sm text-amber-300 mb-2">Foundation Camera Check</div>
              <h2 className="text-2xl font-bold mb-3">Catch orange, yellow, or pink mismatch</h2>
              <p className="text-gray-400">
                Use the Undertone Fix preset to preview a calmer base direction before buying
                foundation that may oxidize or disconnect from your neck in selfies.
              </p>
            </div>
            <Link
              href={localizedHref("/blog/foundation-undertone-fix-orange-selfie-filter-2026")}
              className="inline-flex justify-center rounded-2xl border border-amber-400/40 px-5 py-3 text-sm font-semibold text-amber-100 hover:bg-amber-500/20 transition"
            >
              Read the undertone guide →
            </Link>
          </div>
        </section>

        {/* Olive Undertone Guide */}
        <section className="mb-10 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
          <div className="grid lg:grid-cols-[1fr_auto] gap-5 items-center">
            <div>
              <div className="text-sm text-emerald-300 mb-2">Olive Foundation Check</div>
              <h2 className="text-2xl font-bold mb-3">Test muted olive vs orange or ashy base</h2>
              <p className="text-gray-400">
                Use the Olive Undertone preset when warm foundation turns orange, cool shades look
                gray, or neutral bases still disconnect from your neck in daylight selfies.
              </p>
            </div>
            <Link
              href={localizedHref("/blog/olive-undertone-foundation-match-selfie-filter-2026")}
              className="inline-flex justify-center rounded-2xl border border-emerald-400/40 px-5 py-3 text-sm font-semibold text-emerald-100 hover:bg-emerald-500/20 transition"
            >
              Read the olive undertone guide →
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
