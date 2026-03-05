import { NextRequest, NextResponse } from "next/server";
import { getReplicateClient, fileToDataUrl, demoImages } from "@/lib/replicate";

export const maxDuration = 180;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const style = formData.get("style") as string;
    const stylePrompt = formData.get("stylePrompt") as string;
    const gender = formData.get("gender") as string || "neutral";

    if (!image) {
      return NextResponse.json(
        { error: "Missing image" },
        { status: 400 }
      );
    }

    const replicate = getReplicateClient();

    if (replicate) {
      const dataUrl = await fileToDataUrl(image);

      // Use a face-preserving model for headshots
      // First enhance the face
      const enhancedFace = await replicate.run(
        "tencentarc/gfpgan:0fbacf7afc6c144e5be9767cff80f25aff23e52b0708f17e20f9879b2f21516c",
        {
          input: {
            img: dataUrl,
            version: "v1.4",
            scale: 2,
          },
        }
      );

      // Then apply headshot styling with SDXL
      const prompt = `${stylePrompt}, portrait photography, sharp focus, professional headshot, high quality, 8k`;
      
      const output = await replicate.run(
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        {
          input: {
            prompt: prompt,
            image: enhancedFace,
            num_outputs: 4,
            guidance_scale: 7,
            prompt_strength: 0.35,
            num_inference_steps: 40,
            scheduler: "K_EULER",
          },
        }
      );

      return NextResponse.json({
        success: true,
        images: output,
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
    return NextResponse.json(
      { error: "Failed to generate headshots" },
      { status: 500 }
    );
  }
}
