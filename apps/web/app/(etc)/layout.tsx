import Logo from "@/components/Logo";
import Link from "next/link";
import { PropsWithChildren } from "react";

export default function SubLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto max-w-3xl w-full py-16 global-padding">
      <div className="mb-10">
        <Link href="/">
          <Logo className="h-6" />
        </Link>
      </div>

      {children}
    </div>
  );
}
