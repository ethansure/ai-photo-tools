import { NextRequest, NextResponse } from "next/server";
import { getReplicateClient, fileToDataUrl, demoImages } from "@/lib/replicate";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const style = formData.get("style") as string;
    const stylePrompt = formData.get("stylePrompt") as string;
    const strength = parseFloat(formData.get("strength") as string) || 0.75;

    if (!image || !style) {
      return NextResponse.json(
        { error: "Missing image or style" },
        { status: 400 }
      );
    }

    const replicate = getReplicateClient();

    if (replicate) {
      const dataUrl = await fileToDataUrl(image);

      // Use img2img with SDXL for style transfer
      const enhancedPrompt = `Transform this image ${stylePrompt}, artistic masterpiece, high quality`;
      
      const output = await replicate.run(
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        {
          input: {
            prompt: enhancedPrompt,
            image: dataUrl,
            num_outputs: 1,
            guidance_scale: 7.5,
            prompt_strength: strength,
            num_inference_steps: 40,
            scheduler: "K_EULER",
          },
        }
      );

      const images = output as unknown[];
      
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
