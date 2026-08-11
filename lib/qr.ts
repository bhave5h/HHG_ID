import QRCode from "qrcode";

export interface QRMatrix {
  size: number;
  isDark: (row: number, col: number) => boolean;
}

/**
 * Generate QR code matrix data for a given URL or text string.
 */
export function getQRMatrix(text: string): QRMatrix {
  try {
    const qr = QRCode.create(text || "https://github.com", {
      errorCorrectionLevel: "M",
    });
    const size = qr.modules.size;
    const isDark = (row: number, col: number) => {
      if (row < 0 || row >= size || col < 0 || col >= size) return false;
      return Boolean(qr.modules.get(row, col));
    };
    return { size, isDark };
  } catch (err) {
    console.error("Error generating QR matrix:", err);
    // Fallback simple matrix
    return {
      size: 21,
      isDark: (r, c) => (r === 0 || r === 20 || c === 0 || c === 20 || r === c),
    };
  }
}

/**
 * Render dynamic QR code onto HTML5 Canvas Context.
 */
export function drawQRToCanvas(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  fgColor = "#FEE101",
  bgColor = "#1b6838"
) {
  const { size: qrSize, isDark } = getQRMatrix(text);

  // Background fill
  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, size, size);

  const cellSize = size / qrSize;

  ctx.fillStyle = fgColor;
  for (let r = 0; r < qrSize; r++) {
    for (let c = 0; c < qrSize; c++) {
      if (isDark(r, c)) {
        const cellX = x + c * cellSize;
        const cellY = y + r * cellSize;
        ctx.fillRect(
          Math.floor(cellX),
          Math.floor(cellY),
          Math.ceil(cellSize),
          Math.ceil(cellSize)
        );
      }
    }
  }
}

/**
 * Generate SVG markup string representing the dynamic QR code for server rendering (Sharp).
 */
export function generateQRSvgMarkup(
  text: string,
  x: number,
  y: number,
  size: number,
  fgColor = "#FEE101",
  bgColor = "#1b6838"
): string {
  const { size: qrSize, isDark } = getQRMatrix(text);
  const cellSize = size / qrSize;

  let rects = `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${bgColor}" />`;

  for (let r = 0; r < qrSize; r++) {
    for (let c = 0; c < qrSize; c++) {
      if (isDark(r, c)) {
        const cellX = x + c * cellSize;
        const cellY = y + r * cellSize;
        rects += `<rect x="${cellX.toFixed(2)}" y="${cellY.toFixed(2)}" width="${cellSize.toFixed(2)}" height="${cellSize.toFixed(2)}" fill="${fgColor}" />`;
      }
    }
  }

  return rects;
}
