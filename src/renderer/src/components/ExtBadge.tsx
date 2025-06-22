import { cn } from "@renderer/lib/utils";

const EXT_BADGE_COLORS: Record<string, string> = {
  jpg: "bg-rose-500",
  jpeg: "bg-rose-500",
  png: "bg-emerald-500",
  gif: "bg-yellow-500",
  webp: "bg-blue-500",
  mp4: "bg-purple-500",
  mkv: "bg-purple-600",
  avi: "bg-purple-700",
  mov: "bg-purple-800",
  webm: "bg-purple-900",
};

type ExtBadgeProps = {
  ext: string;
};

export default function ExtBadge({ ext }: ExtBadgeProps) {
  return (
    <span
      className={cn(
        EXT_BADGE_COLORS[ext] || "bg-gray-500",
        "text-[10px] uppercase text-foreground rounded-xs leading-1 flex items-center justify-center px-1.5 py-1.5",
      )}
    >
      {ext.slice(0, 4)}
    </span>
  );
}
