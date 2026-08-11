import type { Metadata } from "next";
import { getCard } from "@/lib/storage/cardStore";
import { getXShareUrl } from "@/lib/share/x";
import HeaderBar from "@/components/builder-generator/HeaderBar";
import Footer from "@/components/ui/Footer";
import CardViewer from "@/components/builder-generator/CardViewer";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const card = await getCard(id);

  const name = card?.name || "HH Goa Builder";
  const stack = card?.stack || "AI × Design × Dev";
  const titleText = card?.builderTitle || "THE PIXEL ARCHITECT";

  const title = `${name} — HH Goa 2026 Builder Pass`;
  const description = `Building, shipping & creating at HH Goa 2026. Stack: ${stack} | Class: ${titleText}. #FrameInGoa`;

  const imageUrl = card?.imageUrl || `/api/card-image/${id}`;

  return {
    title,
    description,
    metadataBase: new URL("https://hhgoa-id.vercel.app"),
    openGraph: {
      title,
      description,
      url: `/card/${id}`,
      siteName: "HH Goa 2026 Builder Pass",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 1800,
          alt: `${name}'s HH Goa 2026 Builder Pass`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function CardSharePage({ params }: Props) {
  const { id } = await params;
  const card = await getCard(id);

  const cardImageUrl = card?.imageUrl || `/api/card-image/${id}`;
  const xShareUrl = getXShareUrl(
    id,
    "https://hhgoa-id.vercel.app",
    card?.name,
  );
  const cardName = card?.name || "HH Goa 2026 Builder Pass";

  return (
    <main className="min-h-screen flex flex-col items-center justify-between px-4 sm:px-6 md:px-10 pt-0 pb-0 bg-[#0B6839] bg-[radial-gradient(rgba(0,0,0,0.25)_2px,transparent_2px)] [background-size:24px_24px] font-body">
      <div className="w-full max-w-4xl flex flex-col items-center">
        {/* Header Bar Component */}
        <HeaderBar />

        {/* 3D Lanyard & 2D Card Viewer + Combined Actions & CTA Card */}
        <div className="w-full flex justify-center mt-2">
          <CardViewer
            cardImageUrl={cardImageUrl}
            cardName={cardName}
            xShareUrl={xShareUrl}
          />
        </div>

        {/* Footer Component */}
        <Footer />
      </div>
    </main>
  );
}
