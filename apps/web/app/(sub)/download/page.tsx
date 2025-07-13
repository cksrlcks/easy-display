import LogoIcon from "@/assets/img/logo-icon.svg";
import { HardDriveDownload } from "lucide-react";
import Image from "next/image";

const DOWNLOAD_LINKS = [
  {
    href: "https://github.com/cksrlcks/easy-display/releases/download/v1.0.2/easy-display-host-1.0.2.exe",
    label: "HOST 다운로드 (Windows)",
  },
  {
    href: "https://github.com/cksrlcks/easy-display/releases/download/v1.0.2/easy-display-host-1.0.2.dmg",
    label: "HOST 다운로드 (MacOS)",
  },
  {
    href: "https://github.com/cksrlcks/easy-display/releases/download/v1.0.2/easy-display-client-1.0.2.apk",
    label: "TV 앱 다운로드 (Android)",
  },
];

export default function page() {
  return (
    <>
      <div className="flex md:flex-row flex-col gap-4 md:gap-6 justify-between items-center mb-10">
        <p>
          Easy Display의 최신 릴리즈 버전은 <br />
          깃헙에서도 다운로드 가능합니다.
        </p>
        <a
          href="https://github.com/cksrlcks/easy-display/releases/latest"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white bg-white/10 hover:bg-white/20 px-6 py-3 rounded-md transition-colors text-xs font-semibold"
        >
          Github 바로가기
        </a>
      </div>
      <ul className="space-y-2 mb-10">
        {DOWNLOAD_LINKS.map(({ href, label }) => (
          <li key={label}>
            <a
              className="flex items-center gap-4 text-white border-2 border-white/20 hover:border-white py-6 px-8 rounded-md transition-colors text-xs font-semibold"
              href={href}
            >
              <Image src={LogoIcon} alt="Easy Display" className="w-8 h-8" />
              <span className="flex-1">{label}</span>
              <HardDriveDownload size={18} />
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
