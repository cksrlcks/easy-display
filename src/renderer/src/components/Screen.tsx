import { cn } from "@renderer/lib/utils";
import { Projector, Tv } from "lucide-react";

import ScreenFrame from "./ScreenFrame";

type ScreenProps = {
  type: "screen" | "device";
  className?: string;
};

export default function Screen({ type, className }: ScreenProps) {
  return (
    <ScreenFrame
      className={cn(
        "flex items-center justify-center text-white bg-gradient-to-tl shadow-lg",
        type === "screen" ? "to-[#58DC9E] from-[#008e76]" : "bg-[#111111]",
        className,
      )}
    >
      {type === "screen" ? <Projector size={48} /> : <Tv size={48} />}
      <span className="sr-only">{type}</span>
    </ScreenFrame>
  );
}
