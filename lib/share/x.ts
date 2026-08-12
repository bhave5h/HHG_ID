import { HASHTAG } from "../constants";

export function getXShareUrl(
  cardId: string,
  siteUrl?: string,
  name?: string
): string {
  const baseUrl = (
    siteUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
  
  const cardPageUrl = `${baseUrl}/card/${cardId}`;
  
  const text = name
    ? `Just claimed my official HH Goa 2026 Builder Pass! 🌴\n\nBuilding, shipping & creating at HH Goa 2026.\n\n${HASHTAG}`
    : `Just claimed my official HH Goa 2026 Builder Pass 🌴\n\nBuilding, shipping & creating at HH Goa 2026.\n\n${HASHTAG}`;

  const params = new URLSearchParams({
    text,
    url: cardPageUrl,
  });

  return `https://x.com/intent/post?${params.toString()}`;
}

