import { NextRequest, NextResponse } from "next/server";
import { getCardImageBuffer, getCard } from "@/lib/storage/cardStore";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return new NextResponse("Card ID is required", { status: 400 });
    }

    // 1. Check cached/local image buffer
    let imageBuffer = getCardImageBuffer(id);

    // 2. Fallback: if not in buffer, check card record image URL
    if (!imageBuffer) {
      const card = await getCard(id);
      if (card?.imageUrl && card.imageUrl.startsWith("http")) {
        try {
          const res = await fetch(card.imageUrl);
          if (res.ok) {
            imageBuffer = Buffer.from(await res.arrayBuffer());
          }
        } catch (e) {
          console.warn("Failed to fetch card image from URL:", e);
        }
      }
    }

    if (!imageBuffer) {
      return new NextResponse("Card Image Not Found", { status: 404 });
    }

    return new NextResponse(new Uint8Array(imageBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("Error in /api/card-image/[id]:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
