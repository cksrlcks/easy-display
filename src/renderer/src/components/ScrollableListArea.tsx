import { cn } from "@renderer/lib/utils";
import { PropsWithChildren } from "react";

type ScrollableListAreaProps = PropsWithChildren<{
  className?: string;
}>;

export default function ScrollableListArea({ children, className }: ScrollableListAreaProps) {
  return (
    <div
      className={cn(
        "bg-black/10 p-10 rounded-lg relative h-full overflow-y-scroll",
        "scrollbar scrollbar-track-black/20 scrollbar-thumb-black",
        "scrollbar-thumb-rounded-0 scrollbar-track-rounded-0 scrollbar-w-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
