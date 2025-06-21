import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isImageFile(ext: string) {
  return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext.toLowerCase());
}
