import Footer from "@/components/Footer";
import IntroButton from "@/components/IntroButton";
import Logo from "@/components/Logo";
import { Menu } from "@/type";
import { Book, HardDriveDownload } from "lucide-react";

const INTRO_LINKS = [
  {
    href: "/download",
    icon: <HardDriveDownload />,
    label: "다운로드",
  },
  {
    href: "/guide",
    icon: <Book />,
    label: "이용 가이드",
  },
] as Menu[];

export default function Page() {
  return (
    <div className="h-dvh flex flex-col max-w-7xl w-[80vw] lg:w-auto mx-auto global-padding">
      <div className="flex flex-1 items-center justify-center flex-col lg:flex-row lg:justify-between gap-10 lg:gap-20">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:flex-1 space-y-6 lg:space-y-10">
          <Logo className="h-8 lg:h-15 w-auto mt-6" />
          <p className="wrap-pretty break-keep">
            Easy Display는 별도의 서버 없이, 같은 네트워크에 연결된 PC와 Android TV 간에
            슬라이드쇼를 송출할 수 있는 디스플레이 전용 프로그램입니다.
          </p>
        </div>
        <div className="lg:flex-1 flex lg:justify-end w-full justify-center">
          <ul className="w-full max-w-100 space-y-1">
            {INTRO_LINKS.map(({ href, label, icon }) => (
              <li key={href}>
                <IntroButton href={href} label={label} icon={icon} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
