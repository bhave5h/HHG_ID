import { NextRequest, NextResponse } from "next/server";
import { getCard } from "@/lib/storage/cardStore";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return new NextResponse("Card ID is required", { status: 400 });
    }

    const card = await getCard(id);
    if (!card || !card.imageUrl) {
      return new NextResponse("Card Image Not Found", { status: 404 });
    }

    return NextResponse.redirect(card.imageUrl);
  } catch (err) {
    console.error("Error in /api/card-image/[id]:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
