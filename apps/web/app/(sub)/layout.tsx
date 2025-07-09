import BackButton from "@/components/BackButton";
import Logo from "@/components/Logo";
import { PropsWithChildren } from "react";

export default function SubLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto max-w-3xl w-full py-16 global-padding">
      <header className="flex items-center gap-4 md:gap-6 mb-10">
        <BackButton />
        <Logo className="h-5 md:h-8" />
      </header>
      {children}
    </div>
  );
}
