import Link from "next/link";

const FOOTER_LINKS = [
  {
    href: "/privacy",
    label: "개인정보 처리방침",
  },
  {
    href: "https://github.com/cksrlcks/easy-display",
    label: "Github",
  },
];

const linkClassName = "text-sm text-gray-500 hover:text-gray-400";

function FooterLink({ href, label }: { href: string; label: string }) {
  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a href={href} className={linkClassName} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClassName}>
      {label}
    </Link>
  );
}

export default function Footer() {
  return (
    <div className="flex justify-center gap-4 py-10">
      {FOOTER_LINKS.map(({ href, label }) => (
        <FooterLink key={`${href}-${label}`} href={href} label={label} />
      ))}
    </div>
  );
}
