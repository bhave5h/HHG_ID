/**
 * Transparent background HEIC to JPEG/PNG converter for iPhone photos.
 */
export async function convertHeicToJpegIfNeeded(file: File): Promise<File> {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  const isHeic =
    fileName.endsWith(".heic") ||
    fileName.endsWith(".heif") ||
    fileType.includes("heic") ||
    fileType.includes("heif");

  if (!isHeic) {
    return file;
  }

  try {
    // Dynamically import heic2any for client-side bundle efficiency
    const heic2any = (await import("heic2any")).default;

    const conversionResult = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });

    const blob = Array.isArray(conversionResult)
      ? conversionResult[0]
      : conversionResult;

    const convertedFileName = file.name.replace(/\.(heic|heif)$/i, ".jpg");
    return new File([blob], convertedFileName, { type: "image/jpeg" });
  } catch (error) {
    console.error("Error converting HEIC image:", error);
    // Return original file if conversion fails or isn't supported
    return file;
  }
}
