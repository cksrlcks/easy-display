import { cn } from "@renderer/lib/utils";
import { Projector, Tv } from "lucide-react";

type ScreenProps = {
  type: "screen" | "device";
  className?: string;
};

export default function Screen({ type, className }: ScreenProps) {
  return (
    <div
      className={cn(
        "aspect-video w-full max-w-[300px] rounded-sm flex items-center justify-center text-white",
        type === "screen" ? "bg-[#58DC9E]" : "bg-[#111111]",
        className,
      )}
    >
      {type === "screen" ? <Projector size={48} /> : <Tv size={48} />}
      <span className="sr-only">{type}</span>
    </div>
  );
}
