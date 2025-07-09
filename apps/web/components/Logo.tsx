import LogoImg from "@/assets/img/logo.svg";
import Image from "next/image";
import { ComponentProps } from "react";

import { cn } from "../lib/utils";

export default function Logo({
  className,
  ...props
}: Omit<ComponentProps<typeof Image>, "src" | "alt">) {
  return (
    <Image src={LogoImg} alt="Easy Display" className={cn("h-8 w-auto", className)} {...props} />
  );
}
