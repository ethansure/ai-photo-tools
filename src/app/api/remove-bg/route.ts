import { NextRequest, NextResponse } from "next/server";
import { getReplicateClient, fileToDataUrl, demoImages } from "@/lib/replicate";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const newBackground = formData.get("background") as string | null;

    if (!image) {
      return NextResponse.json(
        { error: "Missing image" },
        { status: 400 }
      );
    }

    const replicate = getReplicateClient();

    if (replicate) {
      const dataUrl = await fileToDataUrl(image);

      // Remove background using rembg
      const output = await replicate.run(
        "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
        {
          input: {
            image: dataUrl,
          },
        }
      );

      return NextResponse.json({
        success: true,
        image: output,
        transparent: true,
        newBackground,
      });
    } else {
      // Demo mode
      console.log("Demo mode: Background removal");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return NextResponse.json({
        success: true,
        image: demoImages.removedBg,
        transparent: true,
        demo: true,
        message: "Demo mode - Set REPLICATE_API_TOKEN for real background removal",
      });
    }
  } catch (error) {
    console.error("Background removal error:", error);
    return NextResponse.json(
      { error: "Failed to remove background" },
      { status: 500 }
    );
  }
}
