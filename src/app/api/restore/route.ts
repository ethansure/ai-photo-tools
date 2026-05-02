import { NextRequest, NextResponse } from "next/server";
import { getReplicateClient, fileToDataUrl, demoImages, runModel, models } from "@/lib/replicate";
import { createLogger, withLogging } from "@/lib/logger";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  const logger = createLogger("photo-restore");
  
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const optionsRaw = formData.get("options") as string;
    const options = optionsRaw ? JSON.parse(optionsRaw) : ["face"];
    const strengthRaw = String(formData.get("strength") ?? "60");
    const promptOverride = String(formData.get("prompt") ?? "");
    const negativePrompt = String(formData.get("negativePrompt") ?? "");
    const strength = Number.isFinite(Number(strengthRaw)) ? Math.max(0, Math.min(100, Number(strengthRaw))) : 60;

    logger.start({
      imageSize: image?.size,
      imageType: image?.type,
      options,
      strength,
      hasPromptOverride: !!promptOverride,
      hasNegativePrompt: !!negativePrompt,
    });

    if (!image) {
      logger.warn("validation_failed", { hasImage: false });
      return NextResponse.json({ error: "Missing image" }, { status: 400 });
    }

    const replicate = getReplicateClient();

    if (replicate) {
      logger.info("replicate_configured");
      
      const dataUrl = await withLogging(logger, "file_to_dataurl", () =>
        fileToDataUrl(image)
      );
      
      logger.info("calling_gfpgan", { model: "gfpgan" });
      
      const output = await withLogging(logger, "replicate_api", () =>
        runModel(replicate, models.gfpgan, {
          img: dataUrl,
          version: "v1.4",
          scale: 2,
        })
      );

      // Optional upscale pass as a simple "strength" proxy.
      // GFPGAN itself doesn't expose a clean strength knob.
      // We map strength -> ESRGAN scale to give users a tangible control.
      const shouldUpscale = options.includes("upscale") || strength >= 50;
      const upscaleScale = strength >= 80 ? 4 : 2;

      const finalOutput = shouldUpscale
        ? await withLogging(logger, "replicate_upscale", async () => {
            const inUrl = Array.isArray(output) ? output[0] : output;
            return runModel(replicate, models.realEsrgan, {
              image: inUrl,
              scale: upscaleScale,
            });
          })
        : output;

      logger.info("output_received", {
        outputType: typeof output,
        outputUrl: typeof output === "string" ? output.substring(0, 80) : "not a string",
      });

      const outUrl = Array.isArray(finalOutput) ? finalOutput[0] : finalOutput;

      if (typeof outUrl !== "string" || !outUrl.startsWith("http")) {
        logger.error("invalid_output", new Error("Output is not a valid URL"), {
          rawOutput: JSON.stringify(finalOutput).substring(0, 200),
        });
        return NextResponse.json({ error: "Invalid output from API" }, { status: 500 });
      }

      logger.end(true);

      return NextResponse.json({
        success: true,
        image: outUrl,
        options,
        strength,
      });
    } else {
      logger.info("demo_mode");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      logger.end(true, { demo: true });

      return NextResponse.json({
        success: true,
        image: demoImages.restoration,
        options,
        demo: true,
        message: "Demo mode - Set REPLICATE_API_TOKEN for real restoration",
      });
    }
  } catch (error) {
    logger.error("request_failed", error as Error);
    return NextResponse.json({ 
      error: "Failed to restore photo",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
