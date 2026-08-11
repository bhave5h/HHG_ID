import sharp, { OverlayOptions } from "sharp";
import fs from "fs";
import path from "path";
import { generateQRSvgMarkup } from "@/lib/qr";

export interface CardGenerationOptions {
  userPhotoBuffer: Buffer;
  name: string;
  stack: string;
  builderTitle?: string;
  passNo?: string;
  selectedFrame?: string;
  qrUrl?: string;
  photoFilter?: string;
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
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
  const {
    userPhotoBuffer,
    name,
    stack,
    passNo = "57236",
    selectedFrame = "frame1.png",
    qrUrl = "https://x.com/BH4VE5H/",
    photoFilter = "none",
    zoom = 1.0,
    offsetX = 0,
    offsetY = 0,
  } = options;

  const cleanName = (name.trim() || "SAMIRA HADID").toUpperCase();
  const cleanStack = stack.trim() || "Creative Director";
  const cleanPassNo = (passNo.trim() || "57236").toUpperCase();

  // Final Card Dimensions (2:3 Aspect Ratio)
  const CARD_WIDTH = 1200;
  const CARD_HEIGHT = 1800;

  // Photo Frame Dimensions — 1:1 Square
  const PHOTO_WIDTH = 1020;
  const PHOTO_HEIGHT = 1020;
  const PHOTO_X = 90;
  const PHOTO_Y = 320;

  // 1. Process User Photo with Cover Fit, Zoom, and Pan
  let processedPhotoBuffer: Buffer;
  try {
    const basePhoto = sharp(userPhotoBuffer).rotate();
    const meta = await basePhoto.metadata();
    const origW = meta.width || PHOTO_WIDTH;
    const origH = meta.height || PHOTO_HEIGHT;

    const coverScale = Math.max(PHOTO_WIDTH / origW, PHOTO_HEIGHT / origH);
    const effectiveZoom = Math.max(1.0, Math.min(3.0, zoom));
    const totalScale = coverScale * effectiveZoom;

    const scaledW = Math.round(origW * totalScale);
    const scaledH = Math.round(origH * totalScale);

    let resizedPhoto = basePhoto.resize(scaledW, scaledH, { fit: "cover" });

    // Apply Sharp Photo Filter Transformations if specified
    if (photoFilter === "grayscale") {
      resizedPhoto = resizedPhoto.grayscale();
    } else if (photoFilter === "duotone") {
      resizedPhoto = resizedPhoto.grayscale().tint({ r: 254, g: 225, b: 1 });
    }

    const resizedBuffer = await resizedPhoto.toBuffer();

    const panX = effectiveZoom > 1.0 ? offsetX : 0;
    const panY = effectiveZoom > 1.0 ? offsetY : 0;

    const maxCropX = Math.max(0, scaledW - PHOTO_WIDTH);
    const maxCropY = Math.max(0, scaledH - PHOTO_HEIGHT);

    const cropLeft = Math.max(
      0,
      Math.min(maxCropX, Math.round((scaledW - PHOTO_WIDTH) / 2 - panX))
    );
    const cropTop = Math.max(
      0,
      Math.min(maxCropY, Math.round((scaledH - PHOTO_HEIGHT) / 2 - panY))
    );

    // Crop & apply rounded corners mask
    const unmaskedBuffer = await sharp(resizedBuffer)
      .extract({
        left: cropLeft,
        top: cropTop,
        width: PHOTO_WIDTH,
        height: PHOTO_HEIGHT,
      })
      .toFormat("png")
      .toBuffer();

    // Create rounded corners mask (rx=48)
    const roundedMaskSvg = `
      <svg width="${PHOTO_WIDTH}" height="${PHOTO_HEIGHT}">
        <rect x="0" y="0" width="${PHOTO_WIDTH}" height="${PHOTO_HEIGHT}" rx="48" fill="#FFFFFF"/>
      </svg>
    `;
    const roundedMask = await sharp(Buffer.from(roundedMaskSvg)).png().toBuffer();

    processedPhotoBuffer = await sharp(unmaskedBuffer)
      .composite([{ input: roundedMask, blend: "dest-in" }])
      .toBuffer();
  } catch (e) {
    console.error("Error scaling photo in sharp:", e);
    // Green background fallback
    const fallbackSvg = `
      <svg width="${PHOTO_WIDTH}" height="${PHOTO_HEIGHT}">
        <rect x="0" y="0" width="${PHOTO_WIDTH}" height="${PHOTO_HEIGHT}" rx="48" fill="#1b6838"/>
      </svg>
    `;
    processedPhotoBuffer = await sharp(Buffer.from(fallbackSvg)).png().toBuffer();
  }

  // Dynamic QR Code SVG Markup
  const qrSvgContent = generateQRSvgMarkup(
    qrUrl || "https://x.com/BH4VE5H/",
    890,
    1530,
    200,
    "#FEE101",
    "#1b6838"
  );

  // 2. Construct Base SVG Graphics
  const svgOverlay = `
    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .brand-title { font-family: Imbue, Georgia, serif; font-weight: 900; font-size: 90px; fill: #FEE101; letter-spacing: -1px; }
          .header-right-1 { font-family: Imbue, Georgia, serif; font-weight: 900; font-size: 24px; fill: #FEE101; letter-spacing: 2px; }
          .header-right-2 { font-family: Imbue, Georgia, serif; font-weight: 900; font-size: 20px; fill: #FEE101; letter-spacing: 3px; }
          .name-text { font-family: Imbue, Georgia, serif; font-weight: 900; font-size: 88px; fill: #FEE101; letter-spacing: -1px; }
          .role-text { font-family: Arial, Helvetica, sans-serif; font-weight: 700; font-size: 42px; fill: #a3e635; letter-spacing: 0px; }
          .id-text { font-family: Arial, Helvetica, sans-serif; font-weight: 900; font-size: 32px; fill: #0B6839; letter-spacing: 2px; }
        </style>
      </defs>

      <!-- LANYARD HOLE CUT-OUT ON TOP OF CARD -->
      <circle cx="600" cy="60" r="36" fill="#000000" />

      <!-- Subheader Right Text -->
      <text x="${CARD_WIDTH - 90}" y="245" text-anchor="end" class="header-right-1">GOA, INDIA · 28 – 31 OCT 2026</text>
      <text x="${CARD_WIDTH - 90}" y="275" text-anchor="end" class="header-right-2">LESS NOISE. MORE SIGNAL</text>

      <!-- Yellow Photo Frame Border -->
      <rect x="${PHOTO_X}" y="${PHOTO_Y}" width="${PHOTO_WIDTH}" height="${PHOTO_HEIGHT}" rx="48" fill="none" stroke="#FEE101" stroke-width="12" />

      <!-- Bottom Details Section -->
      <!-- Name in Yellow -->
      <text x="90" y="1460" class="name-text">${escapeXml(cleanName)}</text>
      <!-- Role / Stack in Light Green/Yellow -->
      <text x="90" y="1525" class="role-text">${escapeXml(cleanStack)}</text>

      <!-- ID Badge in Yellow Pill Box with Green Text -->
      <g>
        <rect x="90" y="1565" width="300" height="72" rx="18" fill="#FEE101" />
        <text x="240" y="1612" text-anchor="middle" class="id-text">NO : ${escapeXml(cleanPassNo)}</text>
      </g>

      <!-- Dynamic Yellow QR Code Graphic on Bottom Right -->
      <g>
        ${qrSvgContent}
      </g>
    </svg>
  `;

  // Base green card canvas
  const baseCard = sharp({
    create: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      channels: 4,
      background: { r: 27, g: 104, b: 56, alpha: 1 },
    },
  });

  const compositeInputs: OverlayOptions[] = [
    // 1. Processed user photo placed AT PHOTO_X, PHOTO_Y
    {
      input: processedPhotoBuffer,
      top: PHOTO_Y,
      left: PHOTO_X,
    },
    // 2. SVG Overlay placed on top
    {
      input: Buffer.from(svgOverlay),
      top: 0,
      left: 0,
    },
  ];

  // 3. Composite header assets and selected frame overlay
  const assetsDir = path.join(process.cwd(), "public", "assets");

  // logo.png (Top Left)
  try {
    const logoPath = path.join(assetsDir, "logo.png");
    if (fs.existsSync(logoPath)) {
      const logoBuf = await sharp(logoPath)
        .resize(400, 100, { fit: "contain", position: "left" })
        .toBuffer();
      compositeInputs.push({
        input: logoBuf,
        top: 90,
        left: 90,
      });
    }
  } catch (e) {
    console.warn("Could not composite logo.png:", e);
  }

  // goa_hindi.svg (Top Right)
  try {
    const goaHindiPath = path.join(assetsDir, "goa_hindi.svg");
    if (fs.existsSync(goaHindiPath)) {
      const goaHindiBuf = await sharp(goaHindiPath)
        .resize(200, 100, { fit: "contain" })
        .toBuffer();
      compositeInputs.push({
        input: goaHindiBuf,
        top: 90,
        left: CARD_WIDTH - 290,
      });
    }
  } catch (e) {
    console.warn("Could not composite goa_hindi.svg:", e);
  }

  // 2-47.svg (Subheader Left)
  try {
    const studioPath = path.join(assetsDir, "2-47.svg");
    if (fs.existsSync(studioPath)) {
      const studioBuf = await sharp(studioPath)
        .resize(180, 60, { fit: "contain" })
        .toBuffer();
      compositeInputs.push({
        input: studioBuf,
        top: 230,
        left: 90,
      });
    }
  } catch (e) {
    console.warn("Could not composite 2-47.svg:", e);
  }

  // Selected Frame Overlay (if not 'none')
  if (selectedFrame && selectedFrame !== "none") {
    try {
      const framePath = path.join(assetsDir, selectedFrame);
      if (fs.existsSync(framePath)) {
        const frameBuf = await sharp(framePath)
          .resize(PHOTO_WIDTH, PHOTO_HEIGHT, { fit: "cover" })
          .toBuffer();
        compositeInputs.push({
          input: frameBuf,
          top: PHOTO_Y,
          left: PHOTO_X,
        });
      }
    } catch (e) {
      console.warn("Could not composite frame overlay:", e);
    }
  }

  const finalPngBuffer = await baseCard
    .composite(compositeInputs)
    .png({ compressionLevel: 8, quality: 95 })
    .toBuffer();

  return finalPngBuffer;
}

