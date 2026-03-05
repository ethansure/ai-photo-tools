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

      // Generate professional headshots directly with SDXL (simpler approach)
      const genderPrefix = gender === "male" ? "man" : gender === "female" ? "woman" : "person";
      const prompt = `professional corporate headshot portrait of a ${genderPrefix}, ${stylePrompt || "wearing business attire"}, clean studio background, professional lighting, linkedin profile photo, sharp focus, high quality, 8k`;
      
      const output = await replicate.run(
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        {
          input: {
            prompt: prompt,
            image: dataUrl,
            num_outputs: 4,
            guidance_scale: 7.5,
            prompt_strength: 0.4,
            num_inference_steps: 35,
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
