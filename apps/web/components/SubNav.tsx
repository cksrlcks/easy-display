import { Menu } from "@/type";

import ActiveLink from "./ActiveLink";

type SubNavProps = {
  menus: Menu[];
};

export default function SubNav({ menus }: SubNavProps) {
  return (
    <nav>
      <ul className="flex items-center gap-4 border-b border-white/10 mb-10">
        {menus.map((item) => (
          <li key={item.href}>
            <ActiveLink
              href={item.href}
              className=" data-active:text-white border-b-2 border-white/0 data-active:border-white/100 py-4 flex px-2 text-sm font-semibold"
            >
              {item.label}
            </ActiveLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
