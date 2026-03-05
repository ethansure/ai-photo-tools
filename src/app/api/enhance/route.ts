import { NextRequest, NextResponse } from "next/server";
import { getReplicateClient, fileToDataUrl, demoImages, runModel, models } from "@/lib/replicate";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const scale = parseInt(formData.get("scale") as string) || 2;

    if (!image) {
      return NextResponse.json({ error: "Missing image" }, { status: 400 });
    }

    const replicate = getReplicateClient();

    if (replicate) {
      const dataUrl = await fileToDataUrl(image);
      
      // Use Real-ESRGAN for upscaling
      const output = await runModel(replicate, models.realEsrgan, {
        image: dataUrl,
        scale: Math.min(scale, 4),
        face_enhance: false,
      });

      return NextResponse.json({
        success: true,
        image: output,
        scale,
      });
    } else {
      // Demo mode
      console.log("Demo mode: Photo enhancement");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return NextResponse.json({
        success: true,
        image: demoImages.enhanced,
        scale,
        demo: true,
        message: "Demo mode - Set REPLICATE_API_TOKEN for real enhancement",
      });
    }
  } catch (error) {
    console.error("Enhancement error:", error);
    return NextResponse.json({ error: "Failed to enhance photo" }, { status: 500 });
  }
}
