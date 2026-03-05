import { NextRequest, NextResponse } from "next/server";
import { getReplicateClient, fileToDataUrl, demoImages } from "@/lib/replicate";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const scale = parseInt(formData.get("scale") as string) || 2;
    const faceEnhance = formData.get("faceEnhance") === "true";

    if (!image) {
      return NextResponse.json(
        { error: "Missing image" },
        { status: 400 }
      );
    }

    const replicate = getReplicateClient();

    if (replicate) {
      const dataUrl = await fileToDataUrl(image);

      // Use Real-ESRGAN for upscaling
      const output = await replicate.run(
        "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
        {
          input: {
            image: dataUrl,
            scale: Math.min(scale, 4),
            face_enhance: faceEnhance,
          },
        }
      );

      return NextResponse.json({
        success: true,
        image: output,
        scale,
        faceEnhance,
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
    return NextResponse.json(
      { error: "Failed to enhance photo" },
      { status: 500 }
    );
  }
}
