import { cn } from "@renderer/lib/utils";
import { NavLink } from "react-router";

const MENU_ITEMS = [
  { id: "media", path: "/", label: "미디어 관리" },
  { id: "screen", path: "/screen", label: "스크린 관리" },
  { id: "device", path: "/device", label: "디스플레이 관리" },
  { id: "connect", path: "/connect", label: "연결 관리" },
];

export default function Nav() {
  return (
    <nav className="py-6 mb-6 border-b border-white/10">
      <ul className="flex gap-8">
        {MENU_ITEMS.map((item) => (
          <li key={item.id}>
            <NavLink
              to={item.path}
              className={({ isActive }) => cn("text-sm opacity-30", isActive && "opacity-100")}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
