// Client-side image compression applied before upload: re-encodes at 60% quality (and caps
// the longest side) so photos, logos and avatars are stored/served at a fraction of their
// original size. Only raster formats are touched; GIF/SVG and anything that fails or ends up
// larger are returned unchanged, so this can never make an upload worse or break it.
const COMPRESSIBLE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const QUALITY = 0.6;
const MAX_DIMENSION = 2560;

function extensionFor(type: string) {
  return type === "image/jpeg" ? "jpg" : "webp";
}

export async function compressImageFile(file: File): Promise<File> {
  if (!COMPRESSIBLE_TYPES.has(file.type) || typeof createImageBitmap !== "function") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    // PNGs (logos etc.) may have transparency, which JPEG can't hold — WebP keeps it.
    const outputType = file.type === "image/jpeg" ? "image/jpeg" : "image/webp";
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, outputType, QUALITY));
    if (!blob || blob.size >= file.size) return file;

    const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${baseName}.${extensionFor(outputType)}`, { type: outputType, lastModified: Date.now() });
  } catch {
    return file;
  }
}
