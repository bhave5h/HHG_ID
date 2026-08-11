import { NextRequest, NextResponse } from "next/server";
import { generateCardImage } from "@/lib/image/generateCard";
import { generateCardId, saveCard } from "@/lib/storage/cardStore";
import { getXShareUrl } from "@/lib/share/x";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const photoFile = formData.get("photo") as File | null;
    const name = (formData.get("name") as string) || "SAMIRA HADID";
    const stack = (formData.get("stack") as string) || "Creative Director";
    const qrUrl = (formData.get("qrUrl") as string) || "https://github.com";
    const photoFilter = (formData.get("photoFilter") as string) || "none";
    const builderTitle =
      (formData.get("builderTitle") as string) || "THE PIXEL ARCHITECT";
    const passNo = (formData.get("passNo") as string) || "57236";
    const selectedFrame =
      (formData.get("selectedFrame") as string) || "frame1.png";
    const zoom = parseFloat((formData.get("zoom") as string) || "1.0");
    const offsetX = parseFloat((formData.get("offsetX") as string) || "0");
    const offsetY = parseFloat((formData.get("offsetY") as string) || "0");

    if (!photoFile) {
      return NextResponse.json(
        { error: "Please select a photo to generate your ID card." },
        { status: 400 }
      );
    }

    // Validate size (max 15MB)
    if (photoFile.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image file size exceeds 15MB. Please choose a smaller photo." },
        { status: 400 }
      );
    }

    const cardImageDataUrl = formData.get("cardImageDataUrl") as string | null;

    let cardPngBuffer: Buffer;
    if (cardImageDataUrl && cardImageDataUrl.startsWith("data:image/png;base64,")) {
      const base64Data = cardImageDataUrl.replace(/^data:image\/png;base64,/, "");
      cardPngBuffer = Buffer.from(base64Data, "base64");
    } else {
      // Read photo buffer fallback
      const photoArrayBuffer = await photoFile.arrayBuffer();
      const userPhotoBuffer = Buffer.from(photoArrayBuffer);

      // Generate 1200x1800 PNG with Sharp
      cardPngBuffer = await generateCardImage({
        userPhotoBuffer,
        name,
        stack,
        builderTitle,
        passNo,
        selectedFrame,
        qrUrl,
        photoFilter,
        zoom,
        offsetX,
        offsetY,
      });
    }


    // 2. Generate unique Card ID
    const cardId = generateCardId();

    // Determine host / base URL for link sharing
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    // Avoid http for deployed domains unless localhost
    const scheme = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${scheme}://${host}`;

    // 3. Save Card image & metadata
    const cardRecord = await saveCard({
      id: cardId,
      name,
      stack,
      builderTitle,
      imageBuffer: cardPngBuffer,
      baseUrl,
    });

    // 4. Generate X Intent URL
    const xShareUrl = getXShareUrl(cardId, baseUrl, name);
    const cardPageUrl = `${baseUrl}/card/${cardId}`;

    return NextResponse.json({
      success: true,
      id: cardId,
      cardUrl: cardRecord.imageUrl,
      shareUrl: cardPageUrl,
      xShareUrl,
      name: cardRecord.name,
      stack: cardRecord.stack,
      builderTitle: cardRecord.builderTitle,
    });
  } catch (error: any) {
    console.error("Error in /api/generate:", error);
    return NextResponse.json(
      {
        error:
          "Something went wrong while creating your Builder Card. Please try again.",
      },
      { status: 500 }
    );
  }
}
