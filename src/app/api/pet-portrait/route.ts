import { NextRequest, NextResponse } from "next/server";
import { getReplicateClient, fileToDataUrl, demoImages } from "@/lib/replicate";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const style = formData.get("style") as string;
    const petType = formData.get("petType") as string;
    const prompt = formData.get("prompt") as string;

    if (!image || !style) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const replicate = getReplicateClient();

    if (replicate) {
      const dataUrl = await fileToDataUrl(image);

      // Build enhanced prompt for pet portrait
      const enhancedPrompt = `${prompt}, portrait of a ${petType}, high quality, detailed, professional art, 8k resolution`;
      
      // Use SDXL with img2img approach
      const output = await replicate.run(
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        {
          input: {
            prompt: enhancedPrompt,
            image: dataUrl,
            num_outputs: 4,
            guidance_scale: 7.5,
            prompt_strength: 0.8,
            num_inference_steps: 50,
            scheduler: "K_EULER",
            refine: "expert_ensemble_refiner",
            high_noise_frac: 0.8,
          },
        }
      );

      return NextResponse.json({
        success: true,
        images: output,
        style,
        petType,
      });
    } else {
      // Demo mode
      console.log("Demo mode: Replicate API not configured");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return NextResponse.json({
        success: true,
        images: demoImages.petPortrait,
        style,
        petType,
        demo: true,
        message: "Demo mode - Set REPLICATE_API_TOKEN for real AI generation",
      });
    }
  } catch (error) {
    console.error("Pet portrait generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate portraits" },
      { status: 500 }
    );
  }
}
