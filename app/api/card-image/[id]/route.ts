import { NextRequest, NextResponse } from "next/server";
import { getCardImageBuffer } from "@/lib/storage/cardStore";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const buffer = getCardImageBuffer(id);

  if (!buffer) {
    return new NextResponse("Card image not found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
