"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes } from "react";

type BackButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function BackButton({ type = "button", className, ...props }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    const isInternal = document.referrer.startsWith(window.location.origin);

    if (isInternal && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button
      type={type}
      onClick={handleBack}
      className={cn(
        "w-10 aspect-square flex items-center justify-center cursor-pointer hover:bg-white/10 rounded-md transition-colors",
        className,
      )}
      {...props}
    >
      <ArrowLeft />
      <span className="sr-only">뒤로가기</span>
    </button>
  );
}
