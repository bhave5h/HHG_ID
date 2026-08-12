import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

  if (!card) {
    return {
      title: "ID Card Not Found — HH Goa 2026",
      description: "The requested builder card could not be found.",
    };
  }

  const name = card.name || "HH Goa Builder";
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  const title = `${name} — HH Goa 2026`;
  const description = "Building, shipping & creating at HH Goa 2026.";
  const cardPageUrl = `${siteUrl}/card/${id}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title,
      description,
      url: cardPageUrl,
      siteName: "HH Goa 2026 Builder Pass",
      images: [
        {
          url: card.imageUrl,
          width: 1200,
          height: 1800,
          alt: `${name}'s HH Goa 2026 Builder Pass`,
          type: "image/png",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [card.imageUrl],
    },
  };
}

export default async function CardSharePage({ params }: Props) {
  const { id } = await params;
  const card = await getCard(id);

  if (!card) {
    notFound();
  }

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  const xShareUrl = getXShareUrl(id, siteUrl, card.name);
  const cardName = card.name || "HH Goa 2026 Builder Pass";

  return (
    <main className="min-h-screen flex flex-col items-center justify-between px-4 sm:px-6 md:px-10 pt-0 pb-0 bg-[#0B6839] bg-[radial-gradient(rgba(0,0,0,0.25)_2px,transparent_2px)] [background-size:24px_24px] font-body">
      <div className="w-full max-w-4xl flex-1 flex flex-col items-center justify-between">
        {/* Header Bar Component */}
        <HeaderBar />

        {/* 3D Lanyard & 2D Card Viewer + Combined Actions & CTA Card */}
        <div className="w-full flex justify-center mt-2 my-auto">
          <CardViewer
            cardImageUrl={card.imageUrl}
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
