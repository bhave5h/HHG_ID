/**
 * Utility to handle image downloads across desktop and mobile devices.
 * Fetches the image as a blob to trigger a native PNG file download,
 * or opens the image in a new browser tab if direct download is restricted (e.g. mobile Safari / CORS).
 */
export async function downloadOrOpenImage(
  imageUrl: string,
  fileName: string = "HH-Goa-2026-Pass.png"
): Promise<void> {
  if (!imageUrl) return;

  const isMobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);

  // 1. If it's a data URI (e.g., base64 PNG)
  if (imageUrl.startsWith("data:")) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      triggerDownload(blob, fileName, isMobile, imageUrl);
      return;
    } catch (err) {
      console.error("Data URI download failed, opening in new tab:", err);
      openInNewTab(imageUrl);
      return;
    }
  }

  // 2. Network HTTP/HTTPS image URL (e.g. Supabase storage URL)
  try {
    const response = await fetch(imageUrl, {
      mode: "cors",
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const blob = await response.blob();
    triggerDownload(blob, fileName, isMobile, imageUrl);
  } catch (error) {
    console.warn("Direct blob download failed, opening image in new tab instead:", error);
    openInNewTab(imageUrl);
  }
}

function triggerDownload(
  blob: Blob,
  fileName: string,
  isMobile: boolean,
  originalUrl: string
) {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName;

  // On mobile browsers, setting target="_blank" ensures that if download is intercepted,
  // the high-res PNG image is opened in a new tab where the user can save to photos/files.
  if (isMobile) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 15000);
}

function openInNewTab(url: string) {
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (!win) {
    window.location.href = url;
  }
}
