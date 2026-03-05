import { NextRequest, NextResponse } from "next/server";
import { getReplicateClient, fileToDataUrl, demoImages, runModel, models } from "@/lib/replicate";

export const maxDuration = 120;

const stylePrompts: Record<string, string> = {
  royal: "royal portrait painting, wearing ornate gold crown and red velvet royal cape, renaissance oil painting style, dramatic lighting",
  disney: "disney pixar 3d animated character, big cute eyes, colorful, friendly expression, high quality 3d render",
  oil: "classical oil painting portrait, rembrandt style, dark background, dramatic chiaroscuro lighting, museum quality",
  watercolor: "soft watercolor painting, delicate brushstrokes, pastel colors, dreamy atmosphere",
  anime: "anime style, japanese animation, vibrant colors, expressive eyes",
  popart: "pop art style, bold colors, andy warhol inspired, graphic design",
  renaissance: "renaissance master painting, classical composition, dramatic lighting, museum quality",
  cartoon: "cartoon style illustration, colorful, fun, animated movie quality",
  fantasy: "fantasy hero portrait, epic armor, magical lighting, dramatic pose",
  space: "space explorer portrait, astronaut suit, cosmic background, sci-fi",
  vangogh: "van gogh style, thick brushstrokes, swirling patterns, impressionist",
  sketch: "detailed pencil sketch, hand-drawn, artistic hatching",
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const style = formData.get("style") as string;
    const petType = formData.get("petType") as string || "pet";

    if (!image || !style) {
      return NextResponse.json({ error: "Missing image or style" }, { status: 400 });
    }

    const replicate = getReplicateClient();

    if (replicate) {
      const dataUrl = await fileToDataUrl(image);
      const styleDesc = stylePrompts[style] || "artistic portrait";
      const prompt = `${styleDesc}, portrait of a ${petType}, highly detailed, professional quality, masterpiece`;

      const output = await runModel(replicate, models.sdxl, {
        prompt,
        image: dataUrl,
        num_outputs: 4,
        guidance_scale: 7.5,
        prompt_strength: 0.75,
        num_inference_steps: 35,
        scheduler: "K_EULER",
      });

      const images = Array.isArray(output) ? output : [output];

      return NextResponse.json({
        success: true,
        images,
        style,
        petType,
      });
    } else {
      // Demo mode
      console.log("Demo mode: Pet portrait");
      await new Promise((resolve) => setTimeout(resolve, 3000));

      return NextResponse.json({
        success: true,
        images: demoImages.petPortrait,
        style,
        demo: true,
        message: "Demo mode - Set REPLICATE_API_TOKEN for real pet portraits",
      });
    }
  } catch (error) {
    console.error("Pet portrait error:", error);
    return NextResponse.json({ error: "Failed to generate portrait" }, { status: 500 });
  }
}
