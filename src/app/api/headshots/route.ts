import { NextRequest, NextResponse } from "next/server";
import { getReplicateClient, fileToDataUrl, demoImages, runModel, models } from "@/lib/replicate";
import { createLogger, withLogging } from "@/lib/logger";

export const maxDuration = 180;
export const runtime = "nodejs";

const OPENAI_IMAGE_MODEL = "gpt-image-2";

const styleDescriptions: Record<string, string> = {
  // These are intentionally concrete and photography-like.
  // Goal: produce LinkedIn-ready results (suit + clean background) with minimal hallucination.
  corporate:
    "wearing a tailored navy or charcoal suit jacket, crisp white dress shirt, optional tie, pure white or light gray seamless studio background, soft diffused key light (softbox), subtle rim light, head-and-shoulders framing, centered composition, 85mm portrait lens look, natural skin texture, sharp eyes, professional and approachable slight smile",
  linkedin:
    "wearing a tailored suit jacket (navy/charcoal/black) and white dress shirt, pure white seamless background, soft studio lighting, head-and-shoulders crop, centered, 85mm lens look, clean corporate headshot, natural skin texture, sharp focus, professional slight smile",
  executive:
    "wearing a premium dark suit jacket and white dress shirt, subtle tie, neutral seamless background, premium studio lighting, head-and-shoulders portrait, confident executive presence, 85mm lens look, clean and sharp, natural skin texture",
  startup:
    "smart casual: blazer over plain crewneck or button-down, neutral seamless background, soft studio lighting, head-and-shoulders portrait, friendly confident smile, 85mm lens look, clean and modern",
  creative:
    "modern creative professional portrait, minimalist studio background (light gray gradient), soft studio lighting, head-and-shoulders framing, stylish but subtle outfit, natural skin texture, sharp focus, 85mm lens look",
  actor:
    "actor headshot, neutral seamless background, soft studio lighting with gentle contrast, head-and-shoulders framing, natural skin texture, sharp eyes, no heavy retouching, 85mm lens look",
};

const qualityGuardrails =
  "photorealistic, studio photography, high detail, sharp focus, realistic skin texture, no illustration, no CGI, no cartoon, no anime, no painting, no text, no watermark";

export async function POST(request: NextRequest) {
  const logger = createLogger("ai-headshots");
  
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const style = formData.get("style") as string || "corporate";
    const stylePrompt = formData.get("stylePrompt") as string;
    const gender = formData.get("gender") as string || "neutral";

    logger.start({
      imageSize: image?.size,
      imageType: image?.type,
      style,
      gender,
      hasCustomPrompt: !!stylePrompt,
    });

    if (!image) {
      logger.warn("validation_failed", { hasImage: false });
      return NextResponse.json({ error: "Missing image" }, { status: 400 });
    }

    const replicate = getReplicateClient();

    // Prefer OpenAI image edits when configured.
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      logger.info("openai_configured", { model: OPENAI_IMAGE_MODEL });

      const prompt = (() => {
        const genderPrefix = gender === "male" ? "man" : gender === "female" ? "woman" : "person";
        const baseStyle = styleDescriptions[style] || styleDescriptions.linkedin;
        const userAddon = stylePrompt ? `, ${stylePrompt}` : "";
        return `Professional LinkedIn headshot photo of a ${genderPrefix}, ${baseStyle}${userAddon}, ${qualityGuardrails}`;
      })();

      const imageBuffer = Buffer.from(await image.arrayBuffer());

      // Normalize + resize to avoid huge uploads and keep edits stable.
      const sharp = (await import("sharp")).default;
      const normalizedPng = await sharp(imageBuffer, { failOnError: false })
        .rotate()
        .resize({ width: 1024, height: 1024, fit: "inside", withoutEnlargement: true })
        .png({ compressionLevel: 9 })
        .toBuffer();

      const form = new FormData();
      form.append("model", OPENAI_IMAGE_MODEL);
      form.append("prompt", prompt);
      form.append("n", "4");
      form.append("size", "1024x1024");
      form.append("response_format", "b64_json");
      form.append(
        "image",
        new Blob([new Uint8Array(normalizedPng)], { type: "image/png" }),
        "input.png"
      );

      const resp = await withLogging(logger, "openai_images_edits", async () => {
        const r = await fetch("https://api.openai.com/v1/images/edits", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiKey}`,
          },
          body: form as any,
        });
        const text = await r.text();
        if (!r.ok) {
          throw new Error(`OpenAI image edit failed (${r.status}): ${text.slice(0, 300)}`);
        }
        return text;
      });

      const parsed = JSON.parse(resp) as { data?: Array<{ b64_json?: string }> };
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
        style,
        gender,
        backend: "openai",
        model: OPENAI_IMAGE_MODEL,
      });
    }

    if (replicate) {
      logger.info("replicate_configured");
      
      const dataUrl = await withLogging(logger, "file_to_dataurl", async () => {
        try {
          return await fileToDataUrl(image);
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          throw new Error(`Failed to prepare image (HEIC->JPG conversion may have failed): ${msg}`);
        }
      });
      
      const genderPrefix = gender === "male" ? "man" : gender === "female" ? "woman" : "person";
      const baseStyle = styleDescriptions[style] || styleDescriptions.linkedin;
      const userAddon = stylePrompt ? `, ${stylePrompt}` : "";
      const prompt = `professional LinkedIn headshot portrait photo of a ${genderPrefix}, ${baseStyle}${userAddon}, ${qualityGuardrails}`;
      
      logger.info("calling_sdxl", { 
        model: "sdxl", 
        prompt: prompt.substring(0, 100),
        gender,
        style,
      });
      
      const output = await withLogging(logger, "replicate_api", async () => {
        try {
          return await runModel(replicate, models.sdxl, {
            prompt,
            image: dataUrl,
            num_outputs: 4,
            guidance_scale: 6.5,
            // Lower prompt_strength helps preserve identity and reduces unwanted changes.
            prompt_strength: 0.28,
            num_inference_steps: 30,
            scheduler: "K_EULER",
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          throw new Error(`Replicate generation failed: ${msg}`);
        }
      });

      const images = Array.isArray(output) ? output : [output];
      const validImages = images.filter((img): img is string => 
        typeof img === "string" && img.startsWith("http")
      );

      logger.info("output_received", {
        totalImages: images.length,
        validImages: validImages.length,
        sampleUrl: validImages[0]?.substring(0, 80),
      });

      if (validImages.length === 0) {
        logger.error("no_valid_images", new Error("No valid image URLs"), {
          rawOutput: JSON.stringify(output).substring(0, 200),
        });
        return NextResponse.json({ error: "No valid images generated" }, { status: 500 });
      }

      logger.end(true, { imageCount: validImages.length });

      return NextResponse.json({
        success: true,
        images: validImages,
        style,
        gender,
        backend: "replicate",
        model: "sdxl",
      });
    } else {
      logger.info("demo_mode");
      await new Promise((resolve) => setTimeout(resolve, 3000));

      logger.end(true, { demo: true });

      return NextResponse.json({
        success: true,
        images: demoImages.headshot,
        style,
        demo: true,
        message: "Demo mode - Set REPLICATE_API_TOKEN for real headshot generation",
      });
    }
  } catch (error) {
    logger.error("request_failed", error as Error);
    return NextResponse.json({ 
      error: "Failed to generate headshots",
      details: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}
