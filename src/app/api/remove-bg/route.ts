import { NextRequest, NextResponse } from "next/server";
import { getReplicateClient, fileToDataUrl, demoImages, runModel, models } from "@/lib/replicate";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const background = formData.get("background") as string || "transparent";

    if (!image) {
      return NextResponse.json({ error: "Missing image" }, { status: 400 });
    }

    const replicate = getReplicateClient();

    if (replicate) {
      const dataUrl = await fileToDataUrl(image);
      
      // Use rembg for background removal
      const output = await runModel(replicate, models.removeBg, {
        image: dataUrl,
      });

      return NextResponse.json({
        success: true,
        image: output,
        background,
      });
    } else {
      // Demo mode
      console.log("Demo mode: Background removal");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return NextResponse.json({
        success: true,
        image: demoImages.removedBg,
        background,
        demo: true,
        message: "Demo mode - Set REPLICATE_API_TOKEN for real background removal",
      });
    }
  } catch (error) {
    console.error("Background removal error:", error);
    return NextResponse.json({ error: "Failed to remove background" }, { status: 500 });
  }
}
