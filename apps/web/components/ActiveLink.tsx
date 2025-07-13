"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

export default function ActiveLink(props: ComponentProps<typeof Link>) {
  const currentPath = usePathname();
  const isActive = currentPath === props.href;

  return <Link {...props} {...(isActive ? { "data-active": true } : {})} />;
}
