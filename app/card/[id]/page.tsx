import type { Metadata } from "next";
import { getCard } from "@/lib/storage/cardStore";
import { SITE_LINKS, HASHTAG } from "@/lib/constants";
import { getXShareUrl } from "@/lib/share/x";
import Link from "next/link";
import Image from "next/image";

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
          height: 1500,
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
  const xShareUrl = getXShareUrl(id, "https://hhgoa-id.vercel.app", card?.name);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 bg-[#0B6839]">
      {/* Visual Header */}
      <div className="w-full max-w-xl mb-6 text-center">
        <div className="inline-block bg-[#FEE101] text-black font-black uppercase text-xs sm:text-sm px-4 py-1.5 border-2 border-black shadow-[3px_3px_0px_0px_#000] mb-3">
          OFFICIAL BUILDER CREDENTIAL
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow-[2px_2px_0px_#000]">
          {card?.name || "HH Goa 2026 Builder Pass"}
        </h1>
        <p className="text-sm sm:text-base font-bold text-[#FEE101] mt-1">
          {card?.stack} · {card?.builderTitle}
        </p>
      </div>

      {/* Main Card Display Frame */}
      <div className="w-full max-w-xl neo-card p-4 bg-white mb-8">
        <div className="relative w-full aspect-[4/5] bg-zinc-100 border-3 border-black overflow-hidden shadow-[4px_4px_0px_0px_#000]">
          {/* Real Card Image */}
          <img
            src={cardImageUrl}
            alt={card?.name ? `${card.name}'s ID Card` : "HH Goa 2026 Builder ID Card"}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href={cardImageUrl}
            download={`HH-Goa-2026-${(card?.name || "Builder").replace(/\s+/g, "-")}.png`}
            className="neo-btn flex-1 py-3 text-center text-sm sm:text-base font-black text-black"
          >
            📥 DOWNLOAD PASS
          </a>

          <a
            href={xShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="neo-btn-pink flex-1 py-3 text-center text-sm sm:text-base font-black text-white"
          >
            🚀 SHARE ON X ({HASHTAG})
          </a>
        </div>
      </div>

      {/* Create Your Own Call To Action */}
      <div className="w-full max-w-xl neo-card-yellow p-5 text-center">
        <h3 className="text-xl font-black uppercase mb-2">Want Your Own Builder Pass?</h3>
        <p className="text-sm font-bold text-black/80 mb-4">
          Upload your photo, set your title, and join 500+ elite builders at HH Goa 2026.
        </p>
        <Link
          href="/"
          className="neo-btn-black px-6 py-3 text-sm font-black tracking-wider"
        >
          ⚡ CREATE YOUR BUILDER PASS NOW
        </Link>
      </div>

      {/* Promotional Footer Links */}
      <footer className="mt-8 text-center text-xs font-bold text-white/90">
        <div className="flex flex-wrap justify-center gap-4 mb-2">
          <a
            href={SITE_LINKS.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-[#FEE101]"
          >
            Official Website ↗
          </a>
          <a
            href={SITE_LINKS.eventDetails}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-[#FEE101]"
          >
            Event Details ↗
          </a>
          <a
            href={SITE_LINKS.registration}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-[#FEE101]"
          >
            Devfolio Apply ↗
          </a>
        </div>
        <p>© 2026 HH-Goa. Built for Hacker House Goa 2026.</p>
      </footer>
    </main>
  );
}
