import { NextRequest, NextResponse } from "next/server";
import { getReplicateClient, fileToDataUrl, demoImages, runModel, models } from "@/lib/replicate";

export const maxDuration = 180;

const styleDescriptions: Record<string, string> = {
  corporate: "formal business attire, dark suit, clean background",
  linkedin: "professional networking photo, smart casual, confident smile",
  creative: "modern approachable style, creative professional, warm lighting",
  executive: "c-suite executive portrait, powerful presence, premium quality",
  startup: "tech startup founder, casual but professional, innovative",
  actor: "entertainment industry headshot, dramatic lighting, expressive",
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const style = formData.get("style") as string || "corporate";
    const stylePrompt = formData.get("stylePrompt") as string;
    const gender = formData.get("gender") as string || "neutral";

    if (!image) {
      return NextResponse.json({ error: "Missing image" }, { status: 400 });
    }

    const replicate = getReplicateClient();

    if (replicate) {
      const dataUrl = await fileToDataUrl(image);
      
      const genderPrefix = gender === "male" ? "man" : gender === "female" ? "woman" : "person";
      const styleDesc = stylePrompt || styleDescriptions[style] || "professional attire";
      const prompt = `professional corporate headshot portrait of a ${genderPrefix}, ${styleDesc}, clean studio background, professional lighting, linkedin profile photo, sharp focus, high quality, 8k`;
      
      const output = await runModel(replicate, models.sdxl, {
        prompt,
        image: dataUrl,
        num_outputs: 4,
        guidance_scale: 7.5,
        prompt_strength: 0.4,
        num_inference_steps: 35,
        scheduler: "K_EULER",
      });

      const images = Array.isArray(output) ? output : [output];

      return NextResponse.json({
        success: true,
        images,
        style,
        gender,
      });
    } else {
      // Demo mode
      console.log("Demo mode: AI headshots");
      await new Promise((resolve) => setTimeout(resolve, 3000));

      return NextResponse.json({
        success: true,
        images: demoImages.headshot,
        style,
        demo: true,
        message: "Demo mode - Set REPLICATE_API_TOKEN for real headshot generation",
      });
    }
  } catch (error) {
    console.error("Headshot generation error:", error);
    return NextResponse.json({ error: "Failed to generate headshots" }, { status: 500 });
  }
}
