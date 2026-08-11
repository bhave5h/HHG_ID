import type { Metadata } from "next";
import { getCard } from "@/lib/storage/cardStore";
import { getXShareUrl } from "@/lib/share/x";
import Link from "next/link";
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
        {/* Header Bar Component (Normal 100% Scale) */}
        <HeaderBar />

        {/* Scaled-down middle content area (Reduced by 20%) */}
        <div className="w-full flex flex-col items-center gap-2 my-2">
          {/* Call To Action Box */}
          <div className="w-full max-w-md sm:max-w-lg z-50 p-3.5 sm:p-4 text-center bg-[#FFFBE8] rounded-lg shadow-[5px_5px_0px_0px_#084e2a]">
            <h3 className="font-heading sm:text-3xl font-bold text-[#0B6839] uppercase mb-1">
              Want Your Own ID Card ?
            </h3>
            <p className="text-[11px] sm:text-s font-bold text-[#0B6839] mb-2.5 max-w-[300px] mx-auto">
              Upload your photo, set your title, and join 500+ elite builders at HH Goa 2026.
            </p>
            <Link
              href="/"
              className="bg-[#FF0080] rounded-full px-4 py-2 text-lg font-heading font-bold text-white tracking-wider inline-block hover:underline"
            >
              CREATE YOUR OWN ID PASS ↗
            </Link>
          </div>

          {/* 3D Lanyard & 2D Card Viewer with framer-motion fall animation */}
          <div className="w-full flex justify-center">
            <CardViewer
              cardImageUrl={cardImageUrl}
              cardName={cardName}
              xShareUrl={xShareUrl}
            />
          </div>
        </div>

        {/* Footer Component (Normal 100% Scale) */}
        <Footer />
      </div>
    </main>
  );
}
