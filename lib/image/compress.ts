/**
 * Client-side background image compression utility.
 * Resizes large user images to a maximum bounding box of 500x500 pixels while maintaining aspect ratio.
 */
export async function compressImageTo500(file: File): Promise<File> {
  if (!file) return file;

  // Only attempt compression on images
  if (!file.type.startsWith("image/")) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const maxDim = 500;
      let targetWidth = img.width;
      let targetHeight = img.height;

      // If dimensions are already within 500x500, return original file if small enough
      if (targetWidth <= maxDim && targetHeight <= maxDim && file.size < 400 * 1024) {
        resolve(file);
        return;
      }

      // Calculate scale factor while maintaining exact aspect ratio
      if (targetWidth > maxDim || targetHeight > maxDim) {
        if (targetWidth > targetHeight) {
          targetHeight = Math.round((targetHeight * maxDim) / targetWidth);
          targetWidth = maxDim;
        } else {
          targetWidth = Math.round((targetWidth * maxDim) / targetHeight);
          targetHeight = maxDim;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(file);
        return;
      }

      // Draw resized image onto canvas
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Export canvas to PNG blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          const compressedFileName = file.name.replace(/\.[^/.]+$/, "") + "-compressed.png";
          const compressedFile = new File([blob], compressedFileName, {
            type: "image/png",
            lastModified: Date.now(),
          });

          resolve(compressedFile);
        },
        "image/png",
        0.9
      );
    };

    img.onerror = (err) => {
      console.error("Failed to load image for background compression:", err);
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}
