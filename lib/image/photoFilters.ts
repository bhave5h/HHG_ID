/**
 * Photo Appearance / Filter options for ID Card photo viewport.
 * Supported filters: "none", "duotone", "dither", "ascii", "grayscale", "pixelate"
 */

export const FILTER_OPTIONS = [
  { id: "none", label: "Normal" },
  { id: "duotone", label: "Dual Tone" },
  { id: "dither", label: "Dither" },
  { id: "ascii", label: "ASCII" },
  { id: "grayscale", label: "Grayscale" },
  { id: "pixelate", label: "Pixelate" },
];

/**
 * Helper to convert hex to RGB object
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace("#", "");
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Apply selected photo filter to an HTML5 Canvas context region (x, y, w, h).
 */
export function applyPhotoFilterCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  filterType: string
) {
  if (!filterType || filterType === "none") return;

  const width = Math.floor(w);
  const height = Math.floor(h);
  const startX = Math.floor(x);
  const startY = Math.floor(y);

  try {
    const imageData = ctx.getImageData(startX, startY, width, height);
    const data = imageData.data;

    const darkColor = hexToRgb("#0B6839"); // Hacker House Green
    const lightColor = hexToRgb("#FEE101"); // Hacker House Yellow

    if (filterType === "duotone") {
      for (let i = 0; i < data.length; i += 4) {
        const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
        data[i] = Math.round(darkColor.r + lum * (lightColor.r - darkColor.r));
        data[i + 1] = Math.round(darkColor.g + lum * (lightColor.g - darkColor.g));
        data[i + 2] = Math.round(darkColor.b + lum * (lightColor.b - darkColor.b));
      }
      ctx.putImageData(imageData, startX, startY);
    } else if (filterType === "grayscale") {
      for (let i = 0; i < data.length; i += 4) {
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        // High contrast boost
        const v = Math.min(255, Math.max(0, (lum - 128) * 1.3 + 128));
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
      }
      ctx.putImageData(imageData, startX, startY);
    } else if (filterType === "dither") {
      // 4x4 Bayer Dithering Matrix
      const bayer4x4 = [
        [0, 8, 2, 10],
        [12, 4, 14, 6],
        [3, 11, 1, 9],
        [15, 7, 13, 5],
      ];
      for (let py = 0; py < height; py++) {
        for (let px = 0; px < width; px++) {
          const idx = (py * width + px) * 4;
          const lum = (0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]) / 255;
          const threshold = (bayer4x4[py % 4][px % 4] + 0.5) / 16;
          const col = lum > threshold ? lightColor : darkColor;
          data[idx] = col.r;
          data[idx + 1] = col.g;
          data[idx + 2] = col.b;
        }
      }
      ctx.putImageData(imageData, startX, startY);
    } else if (filterType === "pixelate") {
      const pixelSize = Math.max(6, Math.floor(width / 60));
      for (let py = 0; py < height; py += pixelSize) {
        for (let px = 0; px < width; px += pixelSize) {
          const idx = (py * width + px) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(startX + px, startY + py, pixelSize, pixelSize);
        }
      }
    } else if (filterType === "ascii") {
      // Create ASCII character matrix
      const chars = " @#*+=-:. ";
      const charWidth = Math.max(8, Math.floor(width / 50));
      const charHeight = charWidth;

      // Fill background
      ctx.fillStyle = "#1b6838";
      ctx.fillRect(startX, startY, width, height);

      ctx.fillStyle = "#FEE101";
      ctx.font = `bold ${charHeight}px 'Victor Mono', monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let py = 0; py < height; py += charHeight) {
        for (let px = 0; px < width; px += charWidth) {
          const idx = (Math.floor(py) * width + Math.floor(px)) * 4;
          if (idx < data.length) {
            const lum = (0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]) / 255;
            const charIdx = Math.floor((1 - lum) * (chars.length - 1));
            const char = chars[Math.max(0, Math.min(chars.length - 1, charIdx))];

            ctx.fillText(
              char,
              startX + px + charWidth / 2,
              startY + py + charHeight / 2
            );
          }
        }
      }
    }
  } catch (err) {
    console.warn("Could not apply photo filter to canvas:", err);
  }
}
