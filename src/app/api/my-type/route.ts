import { NextRequest, NextResponse } from "next/server";
import { getReplicateClient, fileToDataUrl, runModel, models } from "@/lib/replicate";
import { createLogger, withLogging } from "@/lib/logger";

export const maxDuration = 180;
export const runtime = "nodejs";

const OPENAI_IMAGE_MODEL = "gpt-image-2";

const presetDescriptions: Record<string, string> = {
  muscular:
    "athletic, fit, toned physique, wearing a fitted athletic tank top, clean gym vibe, natural skin texture, sharp focus",
  streetwear:
    "modern streetwear outfit, layered jacket or hoodie, trendy accessories, urban background, cinematic lighting",
  "old-money":
    "old money aesthetic, quiet luxury, tailored outfit, classic accessories, subtle colors, natural daylight, premium look",
  cyberpunk:
    "cyberpunk techwear fashion, neon rim lighting, futuristic outfit, night city background, high contrast, cinematic",
  kpop:
    "K-pop idol style, trendy layered outfit, glossy studio lighting, fashion editorial look, clean background",
  beach:
    "beach vacation lifestyle photo, summer outfit, warm golden hour lighting, ocean background, candid vibe",
};

const qualityGuardrails =
  "photorealistic, high detail, sharp focus, realistic skin texture, no illustration, no CGI, no cartoon, no anime, no painting, no text, no watermark";

export async function POST(request: NextRequest) {
  const logger = createLogger("my-type");

  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const gender = (formData.get("gender") as string) || "male";
    const preset = (formData.get("preset") as string) || "muscular";
    const presetPrompt = (formData.get("presetPrompt") as string) || "";
    const side = ((formData.get("side") as string) || "right").toLowerCase();

    logger.start({
      imageSize: image?.size,
      imageType: image?.type,
      gender,
      preset,
      hasPresetPrompt: !!presetPrompt,
      side,
    });

    if (!image) {
      logger.warn("validation_failed", { hasImage: false });
      return NextResponse.json({ error: "Missing image" }, { status: 400 });
    }

    const companionToken = gender === "female" ? "woman" : "man";
    const basePreset = presetDescriptions[preset] || presetDescriptions.muscular;
    const userAddon = presetPrompt ? `, ${presetPrompt}` : "";
    const prompt = `Photorealistic photo edit. Keep the original subject exactly the same as the input image (do not change their face, body, clothing, or background). Add exactly one ${companionToken} standing next to the original subject on the ${side} side. The added person should match this style: ${basePreset}${userAddon}. Keep everything realistic and natural. No extra people. No text. ${qualityGuardrails}`;

    // Prefer OpenAI image edits when configured.
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      logger.info("openai_configured", { model: OPENAI_IMAGE_MODEL });

      const imageBuffer = Buffer.from(await image.arrayBuffer());
      const sharp = (await import("sharp")).default;
      const normalizedPng = await sharp(imageBuffer, { failOnError: false })
        .rotate()
        .resize({ width: 1024, height: 1024, fit: "inside", withoutEnlargement: true })
        .png({ compressionLevel: 9 })
        .toBuffer();

      // To reliably "add a person next to you" (instead of rewriting the whole photo),
      // we expand the canvas and provide a mask so edits only occur in the new area.
      const meta = await sharp(normalizedPng).metadata();
      const w = meta.width || 1024;
      const h = meta.height || 1024;
      const extra = Math.max(320, Math.round(w * 0.55));

      const extended = await sharp(normalizedPng)
        .extend({
          top: 0,
          bottom: 0,
          left: side === "left" ? extra : 0,
          right: side === "right" ? extra : 0,
          // Extend by duplicating edge pixels for a more natural seam.
          extendWith: "copy" as any,
        })
        .png({ compressionLevel: 9 })
        .toBuffer();

      const mask = await sharp({
        create: {
          width: w + extra,
          height: h,
          // Use RGB to satisfy sharp's TS types; still valid as a mask for OpenAI.
          channels: 3,
          background: { r: 0, g: 0, b: 0 },
        },
      } as any)
        .composite([
          {
            input: await sharp({
              create: {
                width: extra,
                height: h,
                channels: 3,
                background: { r: 255, g: 255, b: 255 },
              },
            } as any)
              .png()
              .toBuffer(),
            left: side === "left" ? 0 : w,
            top: 0,
            blend: "over",
          },
        ])
        .png()
        .toBuffer();

      const form = new FormData();
      form.append("model", OPENAI_IMAGE_MODEL);
      form.append("prompt", prompt);
      form.append("n", "4");
      form.append("size", "1024x1024");
      form.append("response_format", "b64_json");
      form.append(
        "image",
        new Blob([new Uint8Array(extended)], { type: "image/png" }),
        "input.png"
      );
      form.append(
        "mask",
        new Blob([new Uint8Array(mask)], { type: "image/png" }),
        "mask.png"
      );

      const respText = await withLogging(logger, "openai_images_edits", async () => {
        const r = await fetch("https://api.openai.com/v1/images/edits", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiKey}`,
          },
          body: form as any,
        });
        const text = await r.text();
        if (!r.ok) throw new Error(`OpenAI image edit failed (${r.status}): ${text.slice(0, 300)}`);
        return text;
      });

      const parsed = JSON.parse(respText) as { data?: Array<{ b64_json?: string }> };
      const images = (parsed.data || [])
        .map((d) => d.b64_json)
        .filter((b): b is string => typeof b === "string" && b.length > 0)
        .map((b) => `data:image/png;base64,${b}`);

      if (!images.length) {
        return NextResponse.json({ error: "No valid images generated" }, { status: 500 });
      }

      logger.end(true, { imageCount: images.length, backend: "openai" });
      return NextResponse.json({
        success: true,
        images,
        gender,
        preset,
        backend: "openai",
        model: OPENAI_IMAGE_MODEL,
      });
    }

    const replicate = getReplicateClient();
    if (!replicate) {
      logger.info("no_backend_configured");
      return NextResponse.json(
        { error: "No backend configured", details: "Set OPENAI_API_KEY or REPLICATE_API_TOKEN" },
        { status: 500 }
      );
    }

    logger.info("replicate_configured");

    const dataUrl = await withLogging(logger, "file_to_dataurl", async () => {
      try {
        return await fileToDataUrl(image);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        throw new Error(`Failed to prepare image (HEIC->JPG conversion may have failed): ${msg}`);
      }
    });

    // Slightly stronger than headshots since this is a style try-on.
    // Adding a new person needs stronger prompting than simple restyling.
    const promptStrength = preset === "muscular" ? 0.5 : 0.45;

    const output = await withLogging(logger, "replicate_api", async () => {
      try {
        return await runModel(replicate, models.sdxl, {
          prompt,
          image: dataUrl,
          num_outputs: 4,
          guidance_scale: 7,
          prompt_strength: promptStrength,
          num_inference_steps: 32,
          scheduler: "K_EULER",
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        throw new Error(`Replicate generation failed: ${msg}`);
      }
    });

    const images = Array.isArray(output) ? output : [output];
    const validImages = images.filter(
      (img): img is string => typeof img === "string" && img.startsWith("http")
    );

    if (!validImages.length) {
      logger.error("no_valid_images", new Error("No valid image URLs"), {
        rawOutput: JSON.stringify(output).substring(0, 200),
      });
      return NextResponse.json({ error: "No valid images generated" }, { status: 500 });
    }

    logger.end(true, { imageCount: validImages.length, backend: "replicate" });
    return NextResponse.json({
      success: true,
      images: validImages,
      gender,
      preset,
      backend: "replicate",
      model: "sdxl",
    });
  } catch (error) {
    logger.error("request_failed", error as Error);
    return NextResponse.json(
      {
        error: "Failed to generate",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
