import { NextRequest, NextResponse } from "next/server";
import { getReplicateClient, fileToDataUrl, demoImages } from "@/lib/replicate";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const mode = formData.get("mode") as string || "face";
    const faceEnhance = formData.get("faceEnhance") === "true";
    const colorize = formData.get("colorize") === "true";

    if (!image) {
      return NextResponse.json(
        { error: "Missing image" },
        { status: 400 }
      );
    }

    const replicate = getReplicateClient();

    if (replicate) {
      const dataUrl = await fileToDataUrl(image);

      let output;
      
      if (mode === "face" || faceEnhance) {
        // Use GFPGAN for face restoration
        output = await replicate.run(
          "tencentarc/gfpgan:0fbacf7afc6c144e5be9767cff80f25aff23e52b0708f17e20f9879b2f21516c",
          {
            input: {
              img: dataUrl,
              version: "v1.4",
              scale: 2,
            },
          }
        );
      } else {
        // Use CodeFormer for general restoration
        output = await replicate.run(
          "sczhou/codeformer:7de2ea26c616d5bf2245ad0d5e24f0ff9a6204578a5c876db53142edd9d2cd56",
          {
            input: {
              image: dataUrl,
              upscale: 2,
              face_upsample: true,
              background_enhance: true,
              codeformer_fidelity: 0.7,
            },
          }
        );
      }

      // Handle colorization if requested
      if (colorize && output) {
        output = await replicate.run(
          "arielreplicate/deoldify_image:0da600fab0c45a66211339f1c16b71345d22f26ef5b7ea2f7f3c3e9f0e58c90b",
          {
            input: {
              input_image: output,
              render_factor: 35,
            },
          }
        );
      }

      return NextResponse.json({
        success: true,
        image: output,
        mode,
        colorized: colorize,
      });
    } else {
      // Demo mode
      console.log("Demo mode: Photo restoration");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return NextResponse.json({
        success: true,
        image: demoImages.restoration,
        mode,
        demo: true,
        message: "Demo mode - Set REPLICATE_API_TOKEN for real restoration",
      });
    }
  } catch (error) {
    console.error("Restoration error:", error);
    return NextResponse.json(
      { error: "Failed to restore photo" },
      { status: 500 }
    );
  }
}
