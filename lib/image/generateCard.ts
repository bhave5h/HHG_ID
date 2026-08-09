import sharp, { OverlayOptions } from "sharp";
import fs from "fs";
import path from "path";

export interface CardGenerationOptions {
  userPhotoBuffer: Buffer;
  name: string;
  stack: string;
  builderTitle: string;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function generateCardImage(
  options: CardGenerationOptions
): Promise<Buffer> {
  const { userPhotoBuffer, name, stack, builderTitle } = options;

  // Clean inputs
  const cleanName = (name.trim() || "ANONYMOUS BUILDER").toUpperCase();
  const cleanStack = (stack.trim() || "FULLSTACK BUILDER").toUpperCase();
  const cleanTitle = (builderTitle.trim() || "THE SHIPPERS").toUpperCase();

  // Final Card Dimensions (matching public/ui/card.png)
  const CARD_WIDTH = 1200;
  const CARD_HEIGHT = 1500;

  // Photo Box Dimensions
  const PHOTO_WIDTH = 960;
  const PHOTO_HEIGHT = 620;
  const PHOTO_X = 120;
  const PHOTO_Y = 320;

  // 1. Process User Photo: Auto-rotate EXIF, crop to fill Photo Box, resize
  let processedPhotoBuffer: Buffer;
  try {
    processedPhotoBuffer = await sharp(userPhotoBuffer)
      .rotate() // Auto EXIF orientation correction
      .resize(PHOTO_WIDTH, PHOTO_HEIGHT, {
        fit: "cover",
        position: "center",
      })
      .toFormat("png")
      .toBuffer();
  } catch (e) {
    console.error("Error processing user photo with sharp:", e);
    // Fallback: simple white placeholder block
    processedPhotoBuffer = await sharp({
      create: {
        width: PHOTO_WIDTH,
        height: PHOTO_HEIGHT,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .png()
      .toBuffer();
  }

  // Load brand SVG assets
  let logoSvgContent = "";
  let goaHindiSvgContent = "";

  try {
    const logoPath = path.join(process.cwd(), "public", "assets", "logo.svg");
    if (fs.existsSync(logoPath)) {
      logoSvgContent = fs.readFileSync(logoPath, "utf-8");
    }
  } catch (e) {
    console.warn("Could not load logo.svg:", e);
  }

  try {
    const hindiPath = path.join(
      process.cwd(),
      "public",
      "assets",
      "goa_hindi.svg"
    );
    if (fs.existsSync(hindiPath)) {
      goaHindiSvgContent = fs.readFileSync(hindiPath, "utf-8");
    }
  } catch (e) {
    console.warn("Could not load goa_hindi.svg:", e);
  }

  // Construct SVG Overlay for Card Graphics, Frame & Text
  const svgOverlay = `
    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .title-text { font-family: Arial, Helvetica, sans-serif; font-weight: 900; font-size: 54px; fill: #000000; letter-spacing: 2px; }
          .name-text { font-family: Arial, Helvetica, sans-serif; font-weight: 900; font-size: 48px; fill: #000000; letter-spacing: 1px; }
          .stack-text { font-family: Arial, Helvetica, sans-serif; font-weight: 900; font-size: 28px; fill: #FFFFFF; letter-spacing: 1.5px; }
          .builder-text { font-family: Arial, Helvetica, sans-serif; font-weight: 900; font-size: 32px; fill: #FEE101; letter-spacing: 2px; }
          .sub-text { font-family: Arial, Helvetica, sans-serif; font-weight: 800; font-size: 22px; fill: #FFFFFF; letter-spacing: 3px; }
          .badge-text { font-family: Arial, Helvetica, sans-serif; font-weight: 900; font-size: 22px; fill: #000000; letter-spacing: 1px; }
        </style>

        <!-- Drop Shadow Filter for Neo Brutalism -->
        <filter id="shadow" x="0" y="0" width="120%" height="120%">
          <feDropShadow dx="8" dy="8" stdDeviation="0" flood-color="#000000" flood-opacity="1" />
        </filter>
        <filter id="shadow-sm" x="0" y="0" width="120%" height="120%">
          <feDropShadow dx="5" dy="5" stdDeviation="0" flood-color="#000000" flood-opacity="1" />
        </filter>
      </defs>

      <!-- 1. Outer Yellow Frame (44px padding) -->
      <rect x="0" y="0" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="#FEE101" />
      <rect x="44" y="44" width="${CARD_WIDTH - 88}" height="${CARD_HEIGHT - 88}" fill="#0B6839" stroke="#000000" stroke-width="8" />

      <!-- Decorative Grid Lines in Header -->
      <line x1="44" y1="280" x2="${CARD_WIDTH - 44}" y2="280" stroke="#000000" stroke-width="6" />

      <!-- Top Header Bar -->
      <!-- Left Badge: HH GOA 2026 -->
      <rect x="80" y="80" width="340" height="60" fill="#FEE101" stroke="#000000" stroke-width="4" filter="url(#shadow-sm)" />
      <text x="250" y="118" text-anchor="middle" class="badge-text">HH GOA 2026</text>

      <!-- Right Badge: BUILDER PASS -->
      <rect x="${CARD_WIDTH - 420}" y="80" width="340" height="60" fill="#FF0080" stroke="#000000" stroke-width="4" filter="url(#shadow-sm)" />
      <text x="${CARD_WIDTH - 250}" y="118" text-anchor="middle" class="badge-text" fill="#FFFFFF">BUILDER PASS</text>

      <!-- Header Center Subtitle -->
      <text x="${CARD_WIDTH / 2}" y="220" text-anchor="middle" class="sub-text">HACKER HOUSE GOA · 2026 EDITION</text>
      <text x="${CARD_WIDTH / 2}" y="255" text-anchor="middle" class="sub-text" font-size="16px" fill="#FEE101">28 – 31 OCT 2026 · GOA, INDIA</text>

      <!-- 2. Photo Container Box Background Shadow & Frame -->
      <!-- Shadow Box behind photo -->
      <rect x="${PHOTO_X + 10}" y="${PHOTO_Y + 10}" width="${PHOTO_WIDTH}" height="${PHOTO_HEIGHT}" fill="#000000" />
      <!-- Photo Border Frame -->
      <rect x="${PHOTO_X - 6}" y="${PHOTO_Y - 6}" width="${PHOTO_WIDTH + 12}" height="${PHOTO_HEIGHT + 12}" fill="#FEE101" stroke="#000000" stroke-width="6" />

      <!-- Photo Corner Badge -->
      <rect x="${PHOTO_X + 20}" y="${PHOTO_Y + 20}" width="220" height="48" fill="#FF0080" stroke="#000000" stroke-width="4" />
      <text x="${PHOTO_X + 130}" y="${PHOTO_Y + 52}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="18px" fill="#FFFFFF">OFFICIAL BUILDER</text>

      <!-- 3. Details Container Below Photo (Y ~ 980 to 1420) -->

      <!-- Divider line below photo -->
      <line x1="44" y1="980" x2="${CARD_WIDTH - 44}" y2="980" stroke="#000000" stroke-width="6" />

      <!-- Name Card Box -->
      <g filter="url(#shadow)">
        <rect x="80" y="1010" width="${CARD_WIDTH - 160}" height="100" fill="#FEE101" stroke="#000000" stroke-width="5" />
        <text x="110" y="1050" font-family="Arial, sans-serif" font-weight="900" font-size="20px" fill="#000000">BUILDER NAME</text>
        <text x="110" y="1092" class="name-text">${escapeXml(cleanName)}</text>
      </g>

      <!-- Stack / Role Badge Box -->
      <g filter="url(#shadow-sm)">
        <rect x="80" y="1135" width="${CARD_WIDTH - 160}" height="76" fill="#FF0080" stroke="#000000" stroke-width="4" />
        <text x="110" y="1182" class="stack-text">STACK: ${escapeXml(cleanStack)}</text>
      </g>

      <!-- Builder Title Banner -->
      <g filter="url(#shadow-sm)">
        <rect x="80" y="1235" width="${CARD_WIDTH - 160}" height="76" fill="#000000" stroke="#FEE101" stroke-width="4" />
        <text x="110" y="1282" class="builder-text">CLASS: ${escapeXml(cleanTitle)}</text>
      </g>

      <!-- Footer Hashtag & Links -->
      <rect x="44" y="1380" width="${CARD_WIDTH - 88}" height="76" fill="#FEE101" stroke="#000000" stroke-width="4" />
      <text x="80" y="1428" font-family="Arial, sans-serif" font-weight="900" font-size="30px" fill="#000000">#FrameInGoa</text>
      <text x="${CARD_WIDTH - 80}" y="1428" text-anchor="end" font-family="Arial, sans-serif" font-weight="900" font-size="24px" fill="#000000">HHGOA.COM</text>
    </svg>
  `;

  // Base background card layer (1200x1500)
  const baseCard = sharp({
    create: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      channels: 4,
      background: { r: 11, g: 104, b: 57, alpha: 1 },
    },
  });

  // Composite user photo and SVG graphics overlay
  const compositeInputs: OverlayOptions[] = [
    {
      input: processedPhotoBuffer,
      top: PHOTO_Y,
      left: PHOTO_X,
    },
    {
      input: Buffer.from(svgOverlay),
      top: 0,
      left: 0,
    },
  ];

  // If brand logo SVGs exist, overlay them neatly
  if (logoSvgContent) {
    try {
      const resizedLogo = await sharp(Buffer.from(logoSvgContent))
        .resize(160, 140, { fit: "contain" })
        .toBuffer();
      compositeInputs.push({
        input: resizedLogo,
        top: 150,
        left: 80,
      });
    } catch (e) {
      console.warn("Could not composite logo.svg:", e);
    }
  }

  if (goaHindiSvgContent) {
    try {
      const resizedHindi = await sharp(Buffer.from(goaHindiSvgContent))
        .resize(160, 140, { fit: "contain" })
        .toBuffer();
      compositeInputs.push({
        input: resizedHindi,
        top: 150,
        left: CARD_WIDTH - 240,
      });
    } catch (e) {
      console.warn("Could not composite goa_hindi.svg:", e);
    }
  }

  const finalPngBuffer = await baseCard
    .composite(compositeInputs)
    .png({ compressionLevel: 8, quality: 95 })
    .toBuffer();

  return finalPngBuffer;
}
