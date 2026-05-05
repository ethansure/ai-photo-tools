"use client";

type OptimizeOptions = {
  /** Max width/height in px (keeps aspect ratio). */
  maxDim: number;
  /** JPEG quality 0..1 */
  quality: number;
  /** Output mime type */
  mimeType: "image/jpeg" | "image/webp";
};

const DEFAULT_OPTS: OptimizeOptions = {
  maxDim: 1536,
  quality: 0.9,
  mimeType: "image/jpeg",
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Downscale + recompress on the client to keep uploads small and stable.
 * Preserves EXIF orientation via createImageBitmap in most modern browsers.
 */
export async function optimizeImageFile(
  file: File,
  opts: Partial<OptimizeOptions> = {}
): Promise<File> {
  const o: OptimizeOptions = { ...DEFAULT_OPTS, ...opts };

  // If already small and a common web format, keep as-is.
  const isWebImage =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/webp";
  if (isWebImage && file.size <= 4 * 1024 * 1024) return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, o.maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  ctx.drawImage(bitmap, 0, 0, w, h);

  // Try a couple of qualities to keep result under ~4MB when possible.
  const qualities = [o.quality, clamp(o.quality - 0.15, 0.6, 0.95), 0.7];
  for (const q of qualities) {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, o.mimeType, q)
    );
    if (!blob) continue;
    // If we can't get it small enough, still return the best effort.
    if (blob.size <= 4 * 1024 * 1024 || q === qualities[qualities.length - 1]) {
      const outName = file.name.replace(/\.[a-z0-9]+$/i, "") + ".jpg";
      return new File([blob], outName, { type: o.mimeType });
    }
  }

  return file;
}

