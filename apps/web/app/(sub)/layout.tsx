import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import SubNav from "@/components/SubNav";
import { Menu } from "@/type";
import Link from "next/link";
import { PropsWithChildren } from "react";

const SUB_MENUS = [
  {
    href: "/guide",
    label: "이용 가이드",
  },
  {
    href: "/download",
    label: "다운로드",
  },
] as Menu[];

export default function SubLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto max-w-3xl w-full py-16 global-padding">
      <header>
        <div className="mb-10">
          <Link href="/">
            <Logo className="h-6" />
          </Link>
        </div>
        <SubNav menus={SUB_MENUS} />
      </header>
      <div>{children}</div>
      <Footer />
    </div>
  );
}
