import { cn } from "@renderer/lib/utils";
import { PropsWithChildren } from "react";

type ScreenFrameProps = PropsWithChildren<{
  className?: string;
}>;

export default function ScreenFrame({ className, children }: ScreenFrameProps) {
  return (
    <div
      className={cn(
        "aspect-[16/10] w-full max-w-[300px] rounded-sm flex items-center justify-center text-white shadow-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
