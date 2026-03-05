import { NextRequest, NextResponse } from "next/server";
import { getReplicateClient, fileToDataUrl, demoImages, runModel, models } from "@/lib/replicate";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const optionsRaw = formData.get("options") as string;
    const options = optionsRaw ? JSON.parse(optionsRaw) : ["face"];

    if (!image) {
      return NextResponse.json({ error: "Missing image" }, { status: 400 });
    }

    const replicate = getReplicateClient();

    if (replicate) {
      const dataUrl = await fileToDataUrl(image);
      
      // Use GFPGAN for face restoration
      const output = await runModel(replicate, models.gfpgan, {
        img: dataUrl,
        version: "v1.4",
        scale: 2,
      });

      return NextResponse.json({
        success: true,
        image: output,
        options,
      });
    } else {
      // Demo mode
      console.log("Demo mode: Photo restoration");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return NextResponse.json({
        success: true,
        image: demoImages.restoration,
        options,
        demo: true,
        message: "Demo mode - Set REPLICATE_API_TOKEN for real restoration",
      });
    }
  } catch (error) {
    console.error("Restoration error:", error);
    return NextResponse.json({ error: "Failed to restore photo" }, { status: 500 });
  }
}
