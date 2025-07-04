const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"];
const VIDEO_EXTENSIONS = ["mp4", "mkv", "avi", "mov", "webm"];

export function isImageFile(ext: string): boolean {
  return IMAGE_EXTENSIONS.includes(ext.toLowerCase());
}

export function isVideoFile(ext: string): boolean {
  return VIDEO_EXTENSIONS.includes(ext.toLowerCase());
}

export function getFileType(ext: string): "image" | "video" | "etc" {
  const lowerExt = ext.toLowerCase();
  if (IMAGE_EXTENSIONS.includes(lowerExt)) return "image";
  if (VIDEO_EXTENSIONS.includes(lowerExt)) return "video";
  return "etc";
}
