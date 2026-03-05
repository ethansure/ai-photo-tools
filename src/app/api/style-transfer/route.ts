import { NextRequest, NextResponse } from "next/server";
import { getReplicateClient, fileToDataUrl, demoImages, runModel, models } from "@/lib/replicate";

export const maxDuration = 120;

const stylePrompts: Record<string, string> = {
  vangogh: "in the style of Van Gogh, thick brushstrokes, swirling patterns, post-impressionist",
  monet: "in the style of Monet, impressionist, soft colors, light and shadow",
  picasso: "in the style of Picasso, cubist, geometric shapes, abstract",
  anime: "anime style, japanese animation, vibrant colors",
  cartoon: "3D cartoon style, pixar-like, colorful, friendly",
  sketch: "pencil sketch, hand-drawn, black and white",
  watercolor: "watercolor painting, soft edges, flowing colors",
  oilpainting: "classical oil painting, rich textures, museum quality",
  popart: "pop art style, bold colors, comic book, warhol",
  cyberpunk: "cyberpunk style, neon lights, futuristic",
  renaissance: "renaissance painting, classical, dramatic lighting",
  abstract: "abstract art, bold shapes, modern art",
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const style = formData.get("style") as string;
    const customPrompt = formData.get("stylePrompt") as string;
    const strength = parseFloat(formData.get("strength") as string) || 0.75;
    
    const stylePrompt = customPrompt || stylePrompts[style] || "artistic transformation";

    if (!image || !style) {
      return NextResponse.json(
        { error: "Missing image or style" },
        { status: 400 }
      );
    }

    const replicate = getReplicateClient();

    if (replicate) {
      const dataUrl = await fileToDataUrl(image);
      const enhancedPrompt = `Transform this image ${stylePrompt}, artistic masterpiece, highly detailed, professional quality`;
      
      const output = await runModel(replicate, models.sdxl, {
        prompt: enhancedPrompt,
        image: dataUrl,
        num_outputs: 1,
        guidance_scale: 7.5,
        prompt_strength: strength,
        num_inference_steps: 40,
        scheduler: "K_EULER",
      });

      const images = Array.isArray(output) ? output : [output];
      
      return NextResponse.json({
        success: true,
        image: images[0],
        style,
        strength,
      });
    } else {
      // Demo mode
      console.log("Demo mode: Style transfer");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return NextResponse.json({
        success: true,
        image: demoImages.styleTransfer,
        style,
        demo: true,
        message: "Demo mode - Set REPLICATE_API_TOKEN for real style transfer",
      });
    }
  } catch (error) {
    console.error("Style transfer error:", error);
    return NextResponse.json(
      { error: "Failed to apply style" },
      { status: 500 }
    );
  }
}
