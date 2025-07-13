import NextLink from "next/link";

type IntroButtonProps = {
  href: string;
  icon?: React.ReactNode;
  label: string;
};

type ButtonContentProps = {
  icon?: React.ReactNode;
  label: string;
};

const linkClassName =
  "flex items-center border-b-2 border-white/20 py-6 gap-4 hover:border-white/80 transition-colors group text-white";
const iconClassName = "opacity-32 group-hover:opacity-100 transition-opacity";
const arrowRightClassName = "ml-auto";

function ButtonContent({ icon, label }: ButtonContentProps) {
  return (
    <>
      {icon && <span className={iconClassName}>{icon}</span>}
      <span className="font-medium">{label}</span>
      <span className={arrowRightClassName}>&rarr;</span>
    </>
  );
}

export default function IntroButton({ href, icon, label }: IntroButtonProps) {
  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
        <ButtonContent icon={icon} label={label} />
      </a>
    );
  }

  return (
    <NextLink href={href} className={linkClassName}>
      <ButtonContent icon={icon} label={label} />
    </NextLink>
  );
}
