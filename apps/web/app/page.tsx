import Footer from "@/components/Footer";
import IntroButton from "@/components/IntroButton";
import Logo from "@/components/Logo";
import { Book, HardDriveDownload } from "lucide-react";

const INTRO_LINKS = [
  {
    href: "https://github.com/cksrlcks/easy-display/releases/latest",
    icon: <HardDriveDownload />,
    label: "다운로드",
  },
  {
    href: "/guide",
    icon: <Book />,
    label: "이용 가이드",
  },
];

export default function Page() {
  return (
    <div className="h-dvh flex flex-col px-5 md:px-20">
      <div className="max-w-7xl w-full flex flex-1 items-center justify-between mx-auto md:gap-20">
        <div className="flex-1 space-y-10">
          <Logo className="h-15 w-auto mt-6" />
          <p className="wrap-pretty break-keep">
            Easy Display는 별도의 서버 없이, 같은 네트워크에 연결된 PC와 Android TV 간에
            슬라이드쇼를 송출할 수 있는 디스플레이 전용 프로그램입니다.
          </p>
        </div>
        <div className="flex-1 flex justify-end">
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
