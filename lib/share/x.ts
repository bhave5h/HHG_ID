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

  // Use twitter.com/intent/tweet which is the standard Universal Link target registered by X / Twitter mobile apps
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function handleXShare(
  xShareUrl: string,
  name?: string,
  e?: React.MouseEvent
): void {
  if (e) {
    e.preventDefault();
  }

  const isMobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);

  // Normalize web URL to twitter.com/intent/tweet
  const webIntentUrl = xShareUrl.includes("x.com/intent/post")
    ? xShareUrl.replace("x.com/intent/post", "twitter.com/intent/tweet")
    : xShareUrl;

  if (isMobile) {
    // Extract text & url parameters from webIntentUrl or build default message
    let textParam = "";
    let urlParam = "";

    try {
      const parsed = new URL(webIntentUrl);
      textParam = parsed.searchParams.get("text") || "";
      urlParam = parsed.searchParams.get("url") || "";
    } catch {
      textParam = name
        ? `Just claimed my official HH Goa 2026 Builder Pass! 🌴\n\nBuilding, shipping & creating at HH Goa 2026.\n\n${HASHTAG}`
        : `Just claimed my official HH Goa 2026 Builder Pass 🌴\n\nBuilding, shipping & creating at HH Goa 2026.\n\n${HASHTAG}`;
    }

    const fullMessage = textParam && urlParam ? `${textParam}\n\n${urlParam}` : textParam || urlParam;
    
    // Deep link scheme recognized by iOS & Android X (Twitter) mobile app
    const twitterAppScheme = `twitter://post?message=${encodeURIComponent(fullMessage)}`;

    const start = Date.now();
    // Try launching the native app directly
    window.location.href = twitterAppScheme;

    // Fallback to web browser intent if app isn't installed or blocked after 600ms
    setTimeout(() => {
      if (Date.now() - start < 1200) {
        window.open(webIntentUrl, "_blank", "noopener,noreferrer");
      }
    }, 600);
  } else {
    // Desktop: Open web intent in new tab
    window.open(webIntentUrl, "_blank", "noopener,noreferrer");
  }
}


