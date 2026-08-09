import { HASHTAG } from "../constants";

export function getXShareUrl(
  cardId: string,
  baseUrl: string,
  name?: string
): string {
  const cardPageUrl = `${baseUrl}/card/${cardId}`;
  
  const text = name
    ? `Just claimed my official HH Goa 2026 Builder Pass! 🌴\n\nLocked in for India's biggest build-station. See you on the sand.\n\n${HASHTAG}`
    : `Just claimed my official HH Goa 2026 Builder Pass 🌴\n\nBuilding, shipping & creating at HH Goa 2026.\n\n${HASHTAG}`;

  const params = new URLSearchParams({
    text,
    url: cardPageUrl,
  });

  return `https://x.com/intent/post?${params.toString()}`;
}
